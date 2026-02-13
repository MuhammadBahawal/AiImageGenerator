/* eslint-env jest */

jest.mock('react-native-safe-area-context', () => {
  const mockSafeAreaContext = require('react-native-safe-area-context/jest/mock');
  return mockSafeAreaContext.default ?? mockSafeAreaContext;
});

jest.mock('react-native-edge-to-edge', () => {
  return {
    __esModule: true,
    SystemBars: () => null,
  };
});
