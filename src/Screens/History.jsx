import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHistory } from '../store/historyStore';
import { toImageSource } from '../utils/imageSources';
import AppHeader from '../Components/AppHeader';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_PADDING = 16;
const COLUMN_GAP = 12;
const ITEM_GAP = 12;
const COLUMN_WIDTH = (SCREEN_WIDTH - PAGE_PADDING * 2 - COLUMN_GAP) / 2;
const MIN_CARD_HEIGHT = 130;
const MAX_CARD_HEIGHT = 300;
const TAB_BAR_HEIGHT = 74;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const getDefaultRatio = (type) => (type === 'faceSwap' ? 0.78 : 0.82);

const History = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { items } = useHistory();
  const [filter, setFilter] = useState('image');
  const [imageRatios, setImageRatios] = useState({});

  const filteredItems = useMemo(
    () => items.filter(item => item.type === filter),
    [items, filter],
  );

  const resolveSource = useCallback(
    (item) =>
      toImageSource(
        item.image,
        item.type === 'faceSwap' ? 'faceSwapPlaceholder' : 'imagePlaceholder',
      ),
    [],
  );

  const getRatio = useCallback(
    (item, source) => {
      const cachedRatio = imageRatios[item.id];
      if (cachedRatio) {
        return cachedRatio;
      }

      if (typeof source === 'number') {
        const resolved = Image.resolveAssetSource(source);
        if (resolved?.width && resolved?.height) {
          return resolved.width / resolved.height;
        }
      }

      return getDefaultRatio(item.type);
    },
    [imageRatios],
  );

  const buildCard = useCallback(
    (item) => {
      const source = resolveSource(item);
      const ratio = getRatio(item, source);
      const cardHeight = clamp(COLUMN_WIDTH / ratio, MIN_CARD_HEIGHT, MAX_CARD_HEIGHT);
      return { item, source, cardHeight };
    },
    [getRatio, resolveSource],
  );

  const columns = useMemo(() => {
    const nextColumns = [
      { items: [], height: 0 },
      { items: [], height: 0 },
    ];

    filteredItems.forEach((item) => {
      const card = buildCard(item);
      const targetColumn = nextColumns[0].height <= nextColumns[1].height ? 0 : 1;
      nextColumns[targetColumn].items.push(card);
      nextColumns[targetColumn].height += card.cardHeight + ITEM_GAP;
    });

    return nextColumns;
  }, [buildCard, filteredItems]);

  const handleImageLoad = useCallback((id, event) => {
    const loaded = event?.nativeEvent?.source;
    if (!loaded?.width || !loaded?.height) {
      return;
    }

    const ratio = loaded.width / loaded.height;
    if (!Number.isFinite(ratio) || ratio <= 0) {
      return;
    }

    setImageRatios((prev) => {
      const existing = prev[id];
      if (existing && Math.abs(existing - ratio) < 0.01) {
        return prev;
      }
      return { ...prev, [id]: ratio };
    });
  }, []);

  const renderCard = useCallback(
    ({ item, source, cardHeight }) => (
      <View key={item.id} style={[styles.card, { height: cardHeight }]}>
        <Image
          source={source}
          style={styles.cardImage}
          onLoad={(event) => handleImageLoad(item.id, event)}
        />
      </View>
    ),
    [handleImageLoad],
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
        <ScrollView
          contentContainerStyle={[
            styles.waterfallContent,
            { paddingBottom: Math.max(insets.bottom + TAB_BAR_HEIGHT + 30, 120) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.columnsWrap}>
            <View style={styles.column}>
              {columns[0].items.map(renderCard)}
            </View>
            <View style={styles.column}>
              {columns[1].items.map(renderCard)}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingHorizontal: PAGE_PADDING,
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
  waterfallContent: {
    paddingBottom: 100,
  },
  columnsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  column: {
    width: COLUMN_WIDTH,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
    marginBottom: ITEM_GAP,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f0f0f',
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
