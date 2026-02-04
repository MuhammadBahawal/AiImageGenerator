import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import SidebarIcon from '../../assets/images/SidebarIcon.svg';
import Proicon from '../../assets/images/Proicon.svg';
import AspectSelector from '../Components/AspectSelector';
import Styles from '../Components/Styles';
import Explore from '../Components/Explore';
const Home = () => {
  const [text, setText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const route = useRoute();

  useEffect(() => {
    if (route.params?.selectedStyle !== undefined) {
      setSelectedStyle(route.params.selectedStyle);
    }
  }, [route.params?.selectedStyle]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => {
            /* Sidebar icon press handler */
          }}
        >
          <SidebarIcon width={30} height={30} />
        </TouchableOpacity>
        <Text style={styles.headertitle} numberOfLines={2}>
          AI Image Generator
        </Text>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => {
            /* Click to open proscreen */
          }}
        >
          <Proicon style={styles.headerProIcon} />
        </TouchableOpacity>
      </View>
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
          onPressItem={item => console.log('pressed item', item.id)}
          onPressGenerate={() =>
            console.log('Generate pressed', { prompt: text, style: selectedStyle })
          }
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
  header: {
    minHeight: 50,
    width: '100%',
    color: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sideButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headertitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 8,
    lineHeight: 26,
    includeFontPadding: false,
  },
  headerProIcon: {
    height: 35,
    width: 35,
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
