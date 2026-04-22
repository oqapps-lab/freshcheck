import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export type NotifItem = {
  id: string;
  name: string;
  daysLeft: number;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests permission; safe to call repeatedly. Returns true if we may
 * post local notifications.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (!Device.isDevice) return false; // simulators don't deliver push
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  if (settings.status === 'denied') return false;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

/**
 * Clears previously-scheduled FreshCheck reminders and schedules new
 * ones for any item expiring in \u22642 days. Idempotent.
 */
export async function refreshExpiryReminders(items: NotifItem[]): Promise<number> {
  const allowed = await ensureNotificationPermission();
  if (!allowed) return 0;

  const existing = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    existing
      .filter((n) => n.content.data && (n.content.data as Record<string, unknown>).kind === 'expiry')
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );

  const urgent = items.filter((i) => i.daysLeft >= 0 && i.daysLeft <= 2);
  let scheduled = 0;
  for (const item of urgent) {
    // Morning of the day before expiry, at 9am local time.
    const fireAt = new Date();
    fireAt.setDate(fireAt.getDate() + Math.max(0, item.daysLeft - 1));
    fireAt.setHours(9, 0, 0, 0);
    if (fireAt.getTime() <= Date.now()) {
      // if computed time is in the past, push 15min out
      fireAt.setTime(Date.now() + 15 * 60 * 1000);
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: item.daysLeft <= 1 ? `your ${item.name.toLowerCase()} expires soon` : `${item.name.toLowerCase()} — 2 days left`,
        body: 'tap to see what\u2019s worth cooking before it goes.',
        sound: Platform.OS === 'ios' ? 'default' : undefined,
        data: { kind: 'expiry', itemId: item.id },
      },
      trigger: { type: 'date', date: fireAt } as unknown as Notifications.NotificationTriggerInput,
    });
    scheduled += 1;
  }
  return scheduled;
}
