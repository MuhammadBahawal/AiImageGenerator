import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  ActionSheetIOS,
  Modal,
  Pressable,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { swapFace } from '../services/faceSwapService';
import { useHistory } from '../store/historyStore';
import AppHeader from '../Components/AppHeader';

const FaceSwapUpload = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPickerSheet, setShowPickerSheet] = useState(false);
  const { addItem } = useHistory();

  const templateImage = route.params?.templateImage;
  const templateId = route.params?.templateId;

  const previewSource = useMemo(() => {
    if (userImage?.uri) {
      return { uri: userImage.uri };
    }
    return templateImage;
  }, [templateImage, userImage]);

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

  const requestPermission = async (type) => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const permission =
      type === 'camera'
        ? PermissionsAndroid.PERMISSIONS.CAMERA
        : Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const result = await PermissionsAndroid.request(permission, {
      title: type === 'camera' ? 'Camera Permission' : 'Gallery Permission',
      message:
        type === 'camera'
          ? 'We need access to your camera so you can take a photo.'
          : 'We need access to your photos so you can upload an image.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
    });

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      showPermissionAlert('Please allow access in settings to continue.');
      return false;
    }

    Alert.alert('Permission required', 'Please allow access to continue.');
    return false;
  };

  const handlePick = async (type) => {
    const granted = await requestPermission(type);
    if (!granted) {
      return;
    }

    const result =
      type === 'camera'
        ? await launchCamera({
            mediaType: 'photo',
            quality: 1,
            saveToPhotos: true,
          })
        : await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 1,
          });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode === 'permission') {
      showPermissionAlert('Please allow access in settings to continue.');
      return;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Something went wrong.');
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert('Error', 'Could not load the selected image.');
      return;
    }

    setUserImage({
      uri: asset.uri,
      type: asset.type || 'image/jpeg',
      name: asset.fileName || `upload-${Date.now()}.jpg`,
    });
  };

  const openPicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Camera', 'Photo Library', 'Cancel'],
          cancelButtonIndex: 2,
          userInterfaceStyle: 'dark',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            handlePick('camera');
          } else if (buttonIndex === 1) {
            handlePick('gallery');
          }
        },
      );
      return;
    }

    setShowPickerSheet(true);
  };

  const handleSwap = async () => {
    if (!userImage?.uri) {
      Alert.alert('Upload required', 'Please upload your image first.');
      return;
    }

    try {
      setLoading(true);
      const result = await swapFace({
        templateId,
        userImage,
      });

      await addItem({
        type: 'faceSwap',
        image: result.image,
        meta: {
          templateId,
          userImage: userImage?.uri,
        },
      });

      navigation.navigate('FaceSwapResult', {
        image: result.image,
      });
    } catch (error) {
      Alert.alert('Swap failed', error?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader
        title="Face Swap"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.navigate('Premium')}
      />

      <View style={styles.content}>
        <View style={styles.frame}>
          {previewSource ? (
            <Image source={previewSource} style={styles.preview} />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="image-outline" size={36} color="#666" />
              <Text style={styles.emptyText}>Select an image</Text>
            </View>
          )}
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + 20, 28) },
        ]}
      >
        <TouchableOpacity
          style={styles.uploadButton}
          activeOpacity={0.85}
          onPress={openPicker}
        >
          <Ionicons name="cloud-upload-outline" size={18} color="#ffffff" />
          <Text style={styles.uploadText}>Upload Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.swapButton, !userImage && styles.swapButtonDisabled]}
          activeOpacity={0.85}
          onPress={handleSwap}
          disabled={!userImage || loading}
        >
          {loading ? (
            <ActivityIndicator color="#111111" />
          ) : (
            <Text style={styles.swapText}>Swap Face</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={showPickerSheet}
        onRequestClose={() => setShowPickerSheet(false)}
      >
        <Pressable
          style={styles.sheetOverlay}
          onPress={() => setShowPickerSheet(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Upload Image</Text>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={() => {
                setShowPickerSheet(false);
                handlePick('camera');
              }}
            >
              <Text style={styles.sheetButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sheetButton, styles.sheetButtonDivider]}
              onPress={() => {
                setShowPickerSheet(false);
                handlePick('gallery');
              }}
            >
              <Text style={styles.sheetButtonText}>Choose From Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sheetButton, styles.sheetCancel]}
              onPress={() => setShowPickerSheet(false)}
            >
              <Text style={[styles.sheetButtonText, styles.sheetCancelText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default FaceSwapUpload;

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
  frame: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 24,
    padding: 6,
    backgroundColor: '#0B0B0B',
    borderWidth: 1.5,
    borderColor: '#B77A18',
    shadowColor: '#F5A623',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    resizeMode: 'cover',
  },
  emptyState: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0e0e0e',
    borderWidth: 1,
    borderColor: '#1c1c1c',
  },
  emptyText: {
    color: '#777777',
    marginTop: 6,
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 28,
    gap: 14,
  },
  uploadButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#141414',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#222222',
  },
  uploadText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  swapButton: {
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
  swapButtonDisabled: {
    opacity: 0.6,
  },
  swapText: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1b1b1b',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    color: '#9d9d9d',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sheetButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222222',
    borderRadius: 12,
    marginBottom: 10,
  },
  sheetButtonDivider: {
    marginBottom: 18,
  },
  sheetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sheetCancel: {
    backgroundColor: '#2a2a2a',
  },
  sheetCancelText: {
    color: '#f1f1f1',
  },
});
