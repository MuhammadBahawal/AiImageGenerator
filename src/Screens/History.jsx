import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHistory } from '../store/historyStore';
import { toImageSource } from '../utils/imageSources';
import AppHeader from '../Components/AppHeader';
import { useNavigation } from '@react-navigation/native';

const History = () => {
  const navigation = useNavigation();
  const { items } = useHistory();
  const [filter, setFilter] = useState('image');

  const filteredItems = useMemo(
    () => items.filter(item => item.type === filter),
    [items, filter],
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={toImageSource(
          item.image,
          item.type === 'faceSwap' ? 'faceSwapPlaceholder' : 'imagePlaceholder',
        )}
        style={styles.cardImage}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="History"
        onLeftPress={() => navigation.navigate('Settings')}
        onRightPress={() => navigation.navigate('Premium')}
      />

      <View style={styles.segment}>
        <TouchableOpacity
          style={[styles.segmentButton, filter === 'image' && styles.segmentActive]}
          onPress={() => setFilter('image')}
        >
          <Text style={[styles.segmentText, filter === 'image' && styles.segmentTextActive]}>
            Image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, filter === 'faceSwap' && styles.segmentActive]}
          onPress={() => setFilter('faceSwap')}
        >
          <Text
            style={[
              styles.segmentText,
              filter === 'faceSwap' && styles.segmentTextActive,
            ]}
          >
            Face swap
          </Text>
        </TouchableOpacity>
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptyText}>
            Your {filter === 'image' ? 'generated images' : 'face swap results'} will
            appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingHorizontal: 16,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 22,
    padding: 4,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#F5A623',
  },
  segmentText: {
    color: '#bdbdbd',
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#111111',
    fontWeight: '700',
  },
  list: {
    paddingBottom: 90,
    gap: 12,
  },
  card: {
    flex: 1,
    height: 160,
    borderRadius: 16,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: '#9a9a9a',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default History;
