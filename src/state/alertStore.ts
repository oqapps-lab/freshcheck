/**
 * App-wide custom alert/prompt store. The user requires OUR neumorphic dialog
 * everywhere — never the standard OS Alert. `showAlert` mirrors React Native's
 * `Alert.alert(title, message, buttons)` and `showPrompt` replaces the iOS-only
 * `Alert.prompt` (a text field whose value is passed to the button's onPress).
 * <AlertHost/> (mounted at root) renders both.
 */
export type AlertButtonStyle = 'default' | 'cancel' | 'destructive';
export type AlertButton = {
  text: string;
  onPress?: (value?: string) => void;
  style?: AlertButtonStyle;
};
type AlertState = {
  title: string;
  message?: string;
  buttons: AlertButton[];
  prompt?: boolean;
  defaultValue?: string;
  placeholder?: string;
} | null;

let current: AlertState = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function showAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  current = { title, message, buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }] };
  emit();
}

export function showPrompt(
  title: string,
  message?: string,
  buttons?: AlertButton[],
  opts?: { defaultValue?: string; placeholder?: string },
): void {
  current = {
    title,
    message,
    buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }],
    prompt: true,
    defaultValue: opts?.defaultValue,
    placeholder: opts?.placeholder,
  };
  emit();
}

export function dismissAlert(): void {
  if (current === null) return;
  current = null;
  emit();
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
