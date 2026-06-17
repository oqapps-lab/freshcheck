import Constants from 'expo-constants';
import { Platform } from 'react-native';
import i18n from '@/src/i18n';
import { loadNotificationSettings } from '@/src/state/notificationSettings';

export type NotifItem = {
  id: string;
  name: string;
  daysLeft: number;
};

/**
 * expo-notifications is partially unsupported in Expo Go SDK 53+ and
 * crashes on module load when its native event emitters aren't
 * registered (e.g. `NativeJSLogger.addListener is not a function`).
 *
 * We lazy-require the module so the app still launches in Expo Go;
 * scheduling is only attempted on a real device with a proper build.
 */

const isExpoGo = Constants.appOwnership === 'expo';

type NotifModule = typeof import('expo-notifications');
type DeviceModule = typeof import('expo-device');

let notifMod: NotifModule | null | undefined;
let deviceMod: DeviceModule | null | undefined;
let handlerSet = false;

function loadNotif(): NotifModule | null {
  if (notifMod !== undefined) return notifMod;
  if (isExpoGo) {
    notifMod = null;
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    notifMod = require('expo-notifications') as NotifModule;
    if (!handlerSet && notifMod.setNotificationHandler) {
      notifMod.setNotificationHandler({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
      });
      handlerSet = true;
    }
    return notifMod;
  } catch (e) {
    console.warn('[notifications] unavailable', e);
    notifMod = null;
    return null;
  }
}

function loadDevice(): DeviceModule | null {
  if (deviceMod !== undefined) return deviceMod;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    deviceMod = require('expo-device') as DeviceModule;
    return deviceMod;
  } catch {
    deviceMod = null;
    return null;
  }
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const N = loadNotif();
  const D = loadDevice();
  if (!N || !D?.isDevice) return false;
  try {
    const settings = await N.getPermissionsAsync();
    if (settings.granted) return true;
    if (settings.status === 'denied') return false;
    const req = await N.requestPermissionsAsync();
    return req.granted;
  } catch {
    return false;
  }
}

// Cancel every previously-scheduled expiry push (idempotent re-sync). Never
// triggers the permission prompt — safe to call for a no-op.
async function cancelExpiry(N: NotifModule): Promise<void> {
  try {
    if (!(await N.getPermissionsAsync()).granted) return;
    const existing = await N.getAllScheduledNotificationsAsync();
    await Promise.all(
      existing
        .filter((n) => (n.content.data as Record<string, unknown> | undefined)?.kind === 'expiry')
        .map((n) => N.cancelScheduledNotificationAsync(n.identifier)),
    );
  } catch {
    /* notifications module unavailable — nothing to cancel */
  }
}

export async function refreshExpiryReminders(items: NotifItem[]): Promise<number> {
  const N = loadNotif();
  if (!N) return 0;
  const settings = await loadNotificationSettings();

  // Cancel-only sync when there is nothing to remind about OR the user turned
  // expiry reminders OFF — clear stale "expires soon" pushes but never trigger
  // the permission request for a no-op (a fresh install would otherwise see an
  // un-primed system prompt on first load).
  if (items.length === 0 || !settings.expiryEnabled) {
    await cancelExpiry(N);
    return 0;
  }

  const allowed = await ensureNotificationPermission();
  if (!allowed) return 0;

  try {
    await cancelExpiry(N);

    // Items the user wants warning about, per the global lead-time setting.
    const urgent = items.filter((i) => i.daysLeft >= 0 && i.daysLeft <= settings.leadDays);

    // Batch into ONE digest per fire-DATE (was one push PER item — a fridge of
    // 8 expiring items fired 8 separate pushes). Cap the number of digests so we
    // never exceed ~4 notifications in a week even with a huge fridge. Expiry is
    // the only category today and is fully rescheduled each run, so an in-run cap
    // suffices; a shared cross-category ledger comes with remote pushes.
    const WEEKLY_CAP = 4;
    const byDate = new Map<string, { fireAt: Date; names: string[] }>();
    for (const item of urgent) {
      const fireAt = new Date();
      fireAt.setDate(fireAt.getDate() + Math.max(0, item.daysLeft - 1));
      fireAt.setHours(9, 0, 0, 0);
      if (fireAt.getTime() <= Date.now()) fireAt.setTime(Date.now() + 15 * 60 * 1000);
      const key = `${fireAt.getFullYear()}-${fireAt.getMonth() + 1}-${fireAt.getDate()}`;
      const bucket = byDate.get(key);
      if (bucket) bucket.names.push(item.name);
      else byDate.set(key, { fireAt, names: [item.name] });
    }

    let scheduled = 0;
    for (const key of [...byDate.keys()].sort()) {
      if (scheduled >= WEEKLY_CAP) break;
      const bucket = byDate.get(key)!;
      const names = bucket.names;
      let title: string;
      let body: string;
      if (names.length === 1) {
        title = i18n.t('notifications.expiry.titleOne', { name: names[0] });
        body = i18n.t('notifications.expiry.bodyOne');
      } else if (names.length === 2) {
        title = i18n.t('notifications.expiry.titleTwo', { a: names[0], b: names[1] });
        body = i18n.t('notifications.expiry.bodyTwo');
      } else {
        title = i18n.t('notifications.expiry.titleMany', { count: names.length });
        body = i18n.t('notifications.expiry.bodyMany', {
          first: names[0],
          second: names[1],
          more: names.length - 2,
        });
      }
      await N.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: Platform.OS === 'ios' ? 'default' : undefined,
          data: { kind: 'expiry', date: key },
        },
        trigger: { type: 'date', date: bucket.fireAt } as unknown as Parameters<
          NotifModule['scheduleNotificationAsync']
        >[0]['trigger'],
      });
      scheduled += 1;
    }
    return scheduled;
  } catch (e) {
    console.warn('[notifications] schedule failed', e);
    return 0;
  }
}
