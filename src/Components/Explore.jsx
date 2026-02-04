import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
const EXPLORE_DATA = [
  { id: '1', img: require('../../assets/images/asthetic.png'), isPro: true },
  { id: '2', img: require('../../assets/images/jocker.png'), isPro: true },
  { id: '3', img: require('../../assets/images/hush.png'), isPro: true },
  { id: '4', img: require('../../assets/images/Robotic.png'), isPro: true },
];

const navigation = useNavigation();

const { width } = Dimensions.get('window');
const GAP = 10;
const PADDING = 16;
const CARD_W = (width - PADDING * 4 - GAP) / 2;

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Explore = ({ onPressItem, onPressGenerate }) => {
  const insets = useSafeAreaInsets();
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPressItem?.(item)}
        style={[styles.card, { width: CARD_W, height: CARD_W }]}
      >
        <Image source={item.img} style={styles.image} />

        {/* Crown badge */}
        {item.isPro && (
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>👑</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Explore</Text>

      <View style={styles.gridWrap}>
        <FlatList
          data={EXPLORE_DATA}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={{ gap: GAP, paddingBottom: 90 }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />

        {/* Bottom CTA button (overlay) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressGenerate}
          style={[
            styles.generateBtn,
            { bottom: Math.max(16, insets.bottom + 35) },
          ]}
          // onPress = {()=>navigation.navigate('Result')}
          >
          <Text style={styles.generateText}>Generate Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: PADDING,
    paddingTop: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  gridWrap: {
    position: 'relative',
  },

  card: {
    borderRadius: 18,
    backgroundColor: '#121212',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0b0b0b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  badgeIcon: {
    fontSize: 14,
  },

  generateBtn: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 10,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateText: {
    color: '#111',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
