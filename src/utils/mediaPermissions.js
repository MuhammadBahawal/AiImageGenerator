import { PermissionsAndroid, Platform } from 'react-native';
import storage from './storage';

const STORAGE_KEYS = {
  camera: 'permission_camera_asked',
  gallery: 'permission_gallery_asked',
  save: 'permission_save_asked',
};

const ensureAndroidPermission = async ({ permission, rationale, storageKey }) => {
  if (Platform.OS !== 'android') {
    return { granted: true, blocked: false };
  }

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return { granted: true, blocked: false };
  }

  const askedBefore = await storage.getItem(storageKey);
  if (askedBefore === '1') {
    return { granted: false, blocked: true };
  }

  const result = await PermissionsAndroid.request(permission, rationale);
  await storage.setItem(storageKey, '1');

  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    return { granted: true, blocked: false };
  }

  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    return { granted: false, blocked: true };
  }

  return { granted: false, blocked: false };
};

export const requestAndroidCameraPermission = async () => {
  if (Platform.OS !== 'android') {
    return { granted: true, blocked: false };
  }

  return ensureAndroidPermission({
    permission: PermissionsAndroid.PERMISSIONS.CAMERA,
    storageKey: STORAGE_KEYS.camera,
    rationale: {
      title: 'Camera Permission',
      message: 'We need access to your camera so you can take a photo.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
    },
  });
};

export const requestAndroidGalleryPermission = async () => {
  if (Platform.OS !== 'android') {
    return { granted: true, blocked: false };
  }

  return ensureAndroidPermission({
    permission:
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    storageKey: STORAGE_KEYS.gallery,
    rationale: {
      title: 'Gallery Permission',
      message: 'We need access to your photos so you can upload an image.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
    },
  });
};

export const requestAndroidSavePermission = async () => {
  if (Platform.OS !== 'android') {
    return { granted: true, blocked: false };
  }

  if (Platform.Version >= 29) {
    return { granted: true, blocked: false };
  }

  return ensureAndroidPermission({
    permission: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    storageKey: STORAGE_KEYS.save,
    rationale: {
      title: 'Storage Permission',
      message: 'We need permission to save images to your gallery.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
    },
  });
};
