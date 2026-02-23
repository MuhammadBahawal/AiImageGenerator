import { NativeModules, Platform } from 'react-native';

type ImmersiveModeNativeModule = {
  enableImmersive?: () => void;
  disableImmersive?: () => void;
  scheduleImmersiveReapply?: (delayMs: number) => void;
};

const nativeImmersiveMode: ImmersiveModeNativeModule | undefined =
  Platform.OS === 'android'
    ? (NativeModules.ImmersiveMode as ImmersiveModeNativeModule | undefined)
    : undefined;

export const IMMERSIVE_REAPPLY_DELAY_MS = 2500;

export const enableImmersive = (): void => {
  if (Platform.OS !== 'android') {
    return;
  }
  nativeImmersiveMode?.enableImmersive?.();
};

export const disableImmersive = (): void => {
  if (Platform.OS !== 'android') {
    return;
  }
  nativeImmersiveMode?.disableImmersive?.();
};

export const scheduleImmersiveReapply = (
  delayMs: number = IMMERSIVE_REAPPLY_DELAY_MS,
): void => {
  if (Platform.OS !== 'android') {
    return;
  }

  if (nativeImmersiveMode?.scheduleImmersiveReapply) {
    nativeImmersiveMode.scheduleImmersiveReapply(delayMs);
    return;
  }

  nativeImmersiveMode?.enableImmersive?.();
};
