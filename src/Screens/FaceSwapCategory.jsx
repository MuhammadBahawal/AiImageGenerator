import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import FACE_SWAP_SECTIONS from '../data/faceSwapOptions';
import AppHeader from '../Components/AppHeader';

const { width } = Dimensions.get('window');
const GAP = 10;
const PADDING = 16;
const CARD_SIZE = (width - PADDING * 2 - GAP * 2) / 3;

const FaceSwapCategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const categoryId = route.params?.categoryId;

  const category = useMemo(
    () => FACE_SWAP_SECTIONS.find(section => section.id === categoryId),
    [categoryId],
  );

  const data = category?.items ?? [];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('FaceSwapUpload', {
          templateId: item.id,
          templateImage: item.image,
          templateTitle: category?.title,
        })
      }
      style={styles.itemWrap}
    >
      <View style={styles.card}>
        <Image source={item.image} style={styles.cardImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader
        title={category?.title ?? 'Face Swap'}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.navigate('Premium')}
      />

      <FlatList
        data={data}
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
};

export default FaceSwapCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  itemWrap: {
    width: CARD_SIZE,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.25,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
