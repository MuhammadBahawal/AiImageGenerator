import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import STYLE_OPTIONS from '../data/styleOptions';

const { width } = Dimensions.get('window');
const GAP = 10;
const PADDING = 16;
const CARD_SIZE = (width - PADDING * 2 - GAP * 2) / 3;

function AllStyles() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selected, setSelected] = useState(route.params?.selectedStyle ?? 'none');

  const handleSelect = id => {
    setSelected(id);
    navigation.navigate({
      name: 'MainTabs',
      params: {
        screen: 'Image',
        params: { screen: 'Home', params: { selectedStyle: id } },
      },
      merge: true,
    });
  };

  const renderItem = ({ item }) => {
    const isActive = selected === item.id;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelect(item.id)}
        style={styles.itemWrap}
      >
        <View
          style={[
            styles.card,
            isActive && styles.cardActive,
            { width: CARD_SIZE, height: CARD_SIZE },
          ]}
        >
          {item.type === 'none' ? (
            <View style={styles.noneInner}>
              <View style={styles.noneCircle} />
            </View>
          ) : (
            <Image source={item.thumb} style={styles.thumb} />
          )}
        </View>
        <Text
          style={[styles.label, isActive && styles.labelActive]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Image Generator</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.sectionTitle}>Style</Text>

      <FlatList
        data={STYLE_OPTIONS}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{
          paddingHorizontal: PADDING,
          paddingBottom: 24,
          gap: GAP,
        }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default AllStyles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: PADDING,
    paddingTop: 4,
    paddingBottom: 12,
  },
  itemWrap: {
    width: CARD_SIZE,
    alignItems: 'center',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 14,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActive: {
    borderColor: '#F5A623',
    borderWidth: 2,
  },
  thumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noneInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noneCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#8A6A1B',
    opacity: 0.9,
  },
  label: {
    marginTop: 6,
    color: '#cfcfcf',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelActive: {
    color: '#F5A623',
  },
});
