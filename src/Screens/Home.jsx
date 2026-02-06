import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AspectSelector from '../Components/AspectSelector';
import Styles from '../Components/Styles';
import Explore from '../Components/Explore';
import { generateImage } from '../services/imageGenerationService';
import { useHistory } from '../store/historyStore';
import { useSubscription } from '../store/subscriptionStore';
import AppHeader from '../Components/AppHeader';
const Home = () => {
  const [text, setText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [generating, setGenerating] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { addItem } = useHistory();
  const { isActive: isPremiumActive } = useSubscription();

  useEffect(() => {
    if (route.params?.selectedStyle !== undefined) {
      setSelectedStyle(route.params.selectedStyle);
    }
  }, [route.params?.selectedStyle]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      Alert.alert('Prompt required', 'Please enter a prompt.');
      return;
    }

    try {
      setGenerating(true);
      const result = await generateImage({
        prompt: text,
        style: selectedStyle,
      });

      await addItem({
        type: 'image',
        image: result.image,
        meta: { prompt: text, style: selectedStyle },
      });

      navigation.navigate('Result', {
        image: result.image,
        prompt: text,
        style: selectedStyle,
      });
    } catch (error) {
      Alert.alert('Generate failed', error?.message || 'Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExplorePress = (item) => {
    if (item.isPro && !isPremiumActive) {
      navigation.navigate('Premium');
      return;
    }

    navigation.navigate('Result', {
      image: item.img,
      prompt: text,
      style: selectedStyle,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="AI Image Generator"
        onLeftPress={() => navigation.navigate('Settings')}
        onRightPress={() => navigation.navigate('Premium')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* prompt code */}
        <Text style={styles.heading}>Prompt</Text>
        <TextInput
          placeholder="Enter your Prompt"
          value={text}
          onChangeText={setText}
          placeholderTextColor="#cdcdcd"
          style={styles.promptInput}
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.heading}>Select Aspect Ratio</Text>
        <AspectSelector />

        <Styles onChange={setSelectedStyle} value={selectedStyle} />
        <Explore
          onPressItem={handleExplorePress}
          onPressGenerate={handleGenerate}
          isGenerating={generating}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    // marginVertical:16,
  },
  content: {
    paddingTop: 0,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
  },
  //  heading style
  heading: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 18,
    paddingTop: 16,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  promptInput: {
    width: '100%',
    height: 120,
    color: '#ffffff',
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#F5A623',
    borderRadius: 20,
    padding: 16,
  },
});
