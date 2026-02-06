import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Settings = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setting</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.proCard}>
          <View>
            <Text style={styles.proTitle}>PRO OFFER</Text>
            <Text style={styles.proSubtitle}>Premium Features</Text>
          </View>
          <TouchableOpacity
            style={styles.proButton}
            onPress={() => navigation.navigate('Premium')}
          >
            <Text style={styles.proButtonText}>Get it Now</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <Text style={styles.rowText}>Restore Purchase</Text>
          <Ionicons name="chevron-forward" size={18} color="#bfbfbf" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Help & Feedback</Text>
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <Text style={styles.rowText}>Contact Us</Text>
          <Ionicons name="chevron-forward" size={18} color="#bfbfbf" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <Text style={styles.rowText}>Rate Us</Text>
          <Ionicons name="chevron-forward" size={18} color="#bfbfbf" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <Text style={styles.rowText}>Share App</Text>
          <Ionicons name="chevron-forward" size={18} color="#bfbfbf" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Legal</Text>
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <Text style={styles.rowText}>Terms of Use</Text>
          <Ionicons name="chevron-forward" size={18} color="#bfbfbf" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <Text style={styles.rowText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={18} color="#bfbfbf" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  content: {
    paddingHorizontal: 16,
  },
  proCard: {
    backgroundColor: '#F5A623',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proTitle: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  proSubtitle: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  proButton: {
    backgroundColor: '#111111',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  proButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#bcbcbc',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  row: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
