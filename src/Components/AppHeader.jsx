import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SidebarIcon from '../../assets/images/SidebarIcon.svg';
import Proicon from '../../assets/images/Proicon.svg';

const AppHeader = ({
  title,
  onLeftPress,
  onRightPress,
  leftDisabled = false,
  rightDisabled = false,
}) => {
  const navigation = useNavigation();

  const handleLeft = () => {
    if (onLeftPress) {
      onLeftPress();
      return;
    }
    navigation.navigate('Settings');
  };

  const handleRight = () => {
    if (onRightPress) {
      onRightPress();
      return;
    }
    navigation.navigate('Premium');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.sideButton}
        onPress={handleLeft}
        activeOpacity={0.8}
        disabled={leftDisabled}
      >
        <SidebarIcon width={26} height={26} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.sideButton}
        onPress={handleRight}
        activeOpacity={0.8}
        disabled={rightDisabled}
      >
        <Proicon width={26} height={26} />
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
  },
  sideButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
