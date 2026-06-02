/**
 * App-wide custom alert store. The user requires OUR neumorphic dialog
 * everywhere — never the standard OS Alert. `showAlert` mirrors the
 * React Native `Alert.alert(title, message, buttons)` signature so call
 * sites are a drop-in replacement. <AlertHost/> (mounted at root) renders it.
 */
export type AlertButtonStyle = 'default' | 'cancel' | 'destructive';
export type AlertButton = { text: string; onPress?: () => void; style?: AlertButtonStyle };
type AlertState = { title: string; message?: string; buttons: AlertButton[] } | null;

let current: AlertState = null;
const listeners = new Set<() => void>();

export function showAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  current = {
    title,
    message,
    buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }],
  };
  listeners.forEach((l) => l());
}

export function dismissAlert(): void {
  if (current === null) return;
  current = null;
  listeners.forEach((l) => l());
}

export function getAlert(): AlertState {
  return current;
}

export function subscribeAlert(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
