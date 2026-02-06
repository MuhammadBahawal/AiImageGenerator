import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import FACE_SWAP_SECTIONS from '../data/faceSwapOptions';
import AppHeader from '../Components/AppHeader';

const { width } = Dimensions.get('window');
const CARD_W = Math.min(118, (width - 64) / 3);
const CARD_H = Math.round(CARD_W * 1.67);

const FaceSwap = () => {
  const navigation = useNavigation();

  const renderItem = (sectionTitle) => ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() =>
          navigation.navigate('FaceSwapUpload', {
            templateId: item.id,
            templateImage: item.image,
            templateTitle: sectionTitle,
          })
        }
      >
        <Image source={item.image} style={styles.cardImage} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader
        title="Face Swap"
        onLeftPress={() => navigation.navigate('Settings')}
        onRightPress={() => navigation.navigate('Premium')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {FACE_SWAP_SECTIONS.map(section => (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('FaceSwapCategory', {
                    categoryId: section.id,
                  })
                }
              >
                <Text style={styles.seeAllText}>See All &gt;</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={section.items}
              keyExtractor={item => item.id}
              horizontal
              renderItem={renderItem(section.title)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  section: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  seeAllText: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.7,
  },
  row: {
    paddingBottom: 6,
    gap: 10,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
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

export default FaceSwap;
