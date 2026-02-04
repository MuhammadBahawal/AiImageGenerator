import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import STYLE_OPTIONS from '../data/styleOptions';

const Styles = ({ onChange, onSeeAll, value }) => {
  const [selected, setSelected] = useState(value ?? 'none');
  const navigation = useNavigation();

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const selectStyle = id => {
    setSelected(id);
    onChange?.(id);
  };

  const renderItem = ({ item }) => {
    const isActive = selected === item.id;
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => selectStyle(item.id)}
        style={styles.itemWrap}
      >
        <View style={[styles.card, isActive && styles.cardActive]}>
          {item.type === 'none' ? (
            <View style={styles.noneInner}>
              <View style={styles.noneCircle} />
            </View>
          ) : (
            <Image source={item.thumb} style={styles.thumb} />
          )}
        </View>

        <Text style={[styles.label, isActive && styles.labelActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {/* Header Row */}
      <View style={styles.row}>
        <Text style={styles.title}>Style</Text>

        <TouchableOpacity
          onPress={() => {
            if (onSeeAll) {
              onSeeAll();
              return;
            }

            navigation.navigate('AllStyles', { selectedStyle: selected });
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAll}>See All &gt;</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      <FlatList
        data={STYLE_OPTIONS}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Styles;

const CARD = 78;

const styles = StyleSheet.create({
  row: {
    height:60,
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    
  },
  seeAll: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.8,

  },

  list: {
    paddingHorizontal: 16,
  },
  itemWrap: {
    marginRight: 12,
    alignItems: 'center',
  },

  card: {
    width: CARD,
    height: CARD,
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

  // "None" card
  noneInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noneCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: '#8A6A1B',
    opacity: 0.9,
  },

  label: {
    marginTop: 6,
    color: '#cfcfcf',
    fontSize: 12,
    fontWeight: '600',
  },
  labelActive: {
    color: '#F5A623',
  },
});
