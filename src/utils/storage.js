let memoryStore = {};

const getStorage = () => {
  try {
    const mod = require('@react-native-async-storage/async-storage');
    return mod?.default ?? mod;
  } catch (error) {
    return null;
  }
};

const asyncStorage = getStorage();

const storage = {
  async getItem(key) {
    if (asyncStorage?.getItem) {
      return asyncStorage.getItem(key);
    }
    return memoryStore[key] ?? null;
  },
  async setItem(key, value) {
    if (asyncStorage?.setItem) {
      return asyncStorage.setItem(key, value);
    }
    memoryStore[key] = value;
  },
  async removeItem(key) {
    if (asyncStorage?.removeItem) {
      return asyncStorage.removeItem(key);
    }
    delete memoryStore[key];
  },
};

export default storage;
