import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCameraRoll } from '../utils/cameraRoll';
import AppHeader from '../Components/AppHeader';
import { requestAndroidSavePermission } from '../utils/mediaPermissions';

const FALLBACK_IMAGE = require('../../assets/images/jocker.png');

const Result = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const route = useRoute();
  const navigation = useNavigation();
  const tabBarSpace = 72 + 14;

  const imageParam = route.params?.image;
  const imageSource = imageParam
    ? typeof imageParam === 'string'
      ? { uri: imageParam }
      : imageParam
    : FALLBACK_IMAGE;

  const frameWidth = Math.min(width - 48, 360);
  const frameHeight = Math.min(height * 0.62, frameWidth * 1.35);

  const openSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };

  const showPermissionAlert = (message) => {
    Alert.alert('Permission required', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: openSettings },
    ]);
  };

  const requestSavePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const response = await requestAndroidSavePermission();
    if (response.granted) {
      return true;
    }

    if (response.blocked) {
      showPermissionAlert('Please allow storage access in settings to continue.');
      return false;
    }

    Alert.alert('Permission required', 'Please allow storage access.');
    return false;
  };

  const handleSave = async () => {
    try {
      const granted = await requestSavePermission();
      if (!granted) {
        return;
      }

      const uri = typeof imageParam === 'string' ? imageParam : imageSource?.uri;

      if (!uri) {
        Alert.alert('Error', 'No image found to save.');
        return;
      }

      const cameraRoll = getCameraRoll();
      if (!cameraRoll?.save) {
        Alert.alert(
          'Save unavailable',
          'CameraRoll is not linked. Please rebuild the app.',
        );
        return;
      }

      await cameraRoll.save(uri, { type: 'photo' });
      Alert.alert('Saved', 'Image saved to your gallery.');
    } catch (error) {
      Alert.alert('Save failed', error?.message || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader
        title="Image Result"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.navigate('Premium')}
      />

      <View style={styles.content}>
        <View style={[styles.imageFrame, { width: frameWidth, height: frameHeight }]}>
          <Image source={imageSource} style={styles.image} />
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + tabBarSpace + 12, 28) },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Save Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageFrame: {
    borderRadius: 24,
    padding: 6,
    backgroundColor: '#0B0B0B',
    borderWidth: 1.5,
    borderColor: '#B77A18',
    shadowColor: '#F5A623',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    resizeMode: 'cover',
  },
  footer: {
    paddingHorizontal: 28,
  },
  saveButton: {
    height: 54,
    borderRadius: 28,
    backgroundColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  saveText: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
