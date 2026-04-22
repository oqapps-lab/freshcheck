import Constants from 'expo-constants';
import { Platform } from 'react-native';

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

export async function refreshExpiryReminders(items: NotifItem[]): Promise<number> {
  const N = loadNotif();
  if (!N) return 0;
  const allowed = await ensureNotificationPermission();
  if (!allowed) return 0;

  try {
    const existing = await N.getAllScheduledNotificationsAsync();
    await Promise.all(
      existing
        .filter((n) => n.content.data && (n.content.data as Record<string, unknown>).kind === 'expiry')
        .map((n) => N.cancelScheduledNotificationAsync(n.identifier)),
    );

    const urgent = items.filter((i) => i.daysLeft >= 0 && i.daysLeft <= 2);
    let scheduled = 0;
    for (const item of urgent) {
      const fireAt = new Date();
      fireAt.setDate(fireAt.getDate() + Math.max(0, item.daysLeft - 1));
      fireAt.setHours(9, 0, 0, 0);
      if (fireAt.getTime() <= Date.now()) {
        fireAt.setTime(Date.now() + 15 * 60 * 1000);
      }
      await N.scheduleNotificationAsync({
        content: {
          title:
            item.daysLeft <= 1
              ? `your ${item.name.toLowerCase()} expires soon`
              : `${item.name.toLowerCase()} \u2014 2 days left`,
          body: 'tap to see what\u2019s worth cooking before it goes.',
          sound: Platform.OS === 'ios' ? 'default' : undefined,
          data: { kind: 'expiry', itemId: item.id },
        },
        trigger: { type: 'date', date: fireAt } as unknown as Parameters<
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
