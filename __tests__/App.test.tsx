/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@react-navigation/native', () => {
  const MockReact = require('react');
  return {
    NavigationContainer: ({ children }) =>
      MockReact.createElement(MockReact.Fragment, null, children),
    getFocusedRouteNameFromRoute: () => undefined,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const MockReact = require('react');
  const MockNavigator = ({ children }) =>
    MockReact.createElement(MockReact.Fragment, null, children);
  const MockScreen = () => null;

  return {
    createNativeStackNavigator: () => ({
      Navigator: MockNavigator,
      Screen: MockScreen,
    }),
  };
});

jest.mock('@react-navigation/bottom-tabs', () => {
  const MockReact = require('react');
  const MockNavigator = ({ children }) =>
    MockReact.createElement(MockReact.Fragment, null, children);
  const MockScreen = () => null;

  return {
    createBottomTabNavigator: () => ({
      Navigator: MockNavigator,
      Screen: MockScreen,
    }),
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    const tree = ReactTestRenderer.create(<App />);
    await Promise.resolve();
    await Promise.resolve();
    tree.unmount();
  });
});
