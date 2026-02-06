export function getCameraRoll() {
  try {
    const mod = require('@react-native-camera-roll/camera-roll');
    return mod?.default ?? mod;
  } catch (error) {
    return null;
  }
}
