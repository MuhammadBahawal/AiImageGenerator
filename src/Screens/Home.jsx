import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SidebarIcon from '../../assets/images/SidebarIcon.svg';
import Proicon from '../../assets/images/Proicon.svg';
import AspectSelector from '../Components/AspectSelector';

const Home = () => {
  const [text, setText] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              /* Sidebar icon press handler */
            }}
          >
            <SidebarIcon width={30} height={30} />
          </TouchableOpacity>
          <Text style={styles.headertitle}>AI Image Generator</Text>
          <TouchableOpacity
            onPress={() => {
              /* Click to open proscreen */
            }}
          >
            <Proicon style={styles.headerProIcon} />
          </TouchableOpacity>
        </View>
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
        <AspectSelector/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    paddingTop: 0,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
  },
  header: {
    height: 50,
    width: '100%',
    color: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  headertitle: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: '600',
  },
  headerProIcon: {
    height: 35,
    width: 35,
  },
  //  heading style
  heading: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 25,
    padding: 16,
  },
  promptInput: {
    paddingTop: 16,
    width: '100%',
    height: 130,
    color: '#ffffff',
    backgroundColor: '#1A1A1A',
    borderWidth: 1.5,
    borderColor: '#F5A623',
    borderRadius: 20,
    padding: 16,
  },
});
