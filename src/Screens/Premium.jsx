import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSubscription } from '../store/subscriptionStore';
import CrossIcon from '../../assets/images/CrossIcon.svg';
const HERO_IMAGE = require('../../assets/images/jocker.png');

const OPTIONS = [
  {
    id: 'weekly',
    label: 'Weekly',
    price: '$17.89',
    subtitle: '$2.56 per day',
    badge: 'Save 30%',
  },
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$39.99',
    subtitle: 'per month',
    badge: 'Save 30%',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$87.99',
    subtitle: '$7.32 per month',
    badge: null,
  },
];

const Premium = () => {
  const navigation = useNavigation();
  const { setSubscription } = useSubscription();
  const [selected, setSelected] = useState('weekly');

  const selectedOption = useMemo(
    () => OPTIONS.find(option => option.id === selected),
    [selected],
  );

  const handleSubscribe = async () => {
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await setSubscription({ isPremium: true, expiresAt });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <CrossIcon width={22} height={22} />
        </TouchableOpacity>
      </View>

      <ImageBackground source={HERO_IMAGE} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Ionicons name="diamond" size={28} color="#F5A623" />
          <Text style={styles.heroTitle}>UPGRADE TO PREMIUM</Text>
        </View>
      </ImageBackground>

      <View style={styles.features}>
        {[
          'Generate Limitless AI Images',
          'Unlock face swapper model',
          'Bring your imagination to life',
          'High quality results',
          'No Ads & No watermark',
        ].map(text => (
          <View key={text} style={styles.featureRow}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>{text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.options}>
        {OPTIONS.map(option => {
          const isActive = option.id === selected;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, isActive && styles.optionCardActive]}
              onPress={() => setSelected(option.id)}
            >
              <View>
                <Text style={[styles.optionTitle, isActive && styles.optionTitleActive]}>
                  {option.label}
                </Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <View style={styles.optionRight}>
                {option.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{option.badge}</Text>
                  </View>
                ) : null}
                <Text style={styles.optionPrice}>{option.price}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeText}>
          Subscribe {selectedOption ? `• ${selectedOption.price}` : ''}
        </Text>
      </TouchableOpacity>

      <View style={styles.footerLinks}>
        <Text style={styles.footerText}>Privacy Policy</Text>
        <Text style={styles.footerDot}>•</Text>
        <Text style={styles.footerText}>Restore</Text>
        <Text style={styles.footerDot}>•</Text>
        <Text style={styles.footerText}>Terms of Use</Text>
      </View>
    </SafeAreaView>
  );
};

export default Premium;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    height: 220,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  features: {
    marginTop: 16,
    paddingHorizontal: 18,
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F5A623',
  },
  featureText: {
    color: '#d6d6d6',
    fontSize: 13,
  },
  options: {
    marginTop: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  optionCardActive: {
    borderColor: '#F5A623',
  },
  optionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  optionTitleActive: {
    color: '#F5A623',
  },
  optionSubtitle: {
    color: '#9b9b9b',
    fontSize: 12,
    marginTop: 4,
  },
  optionRight: {
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#F5A623',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },
  badgeText: {
    color: '#111111',
    fontSize: 10,
    fontWeight: '700',
  },
  optionPrice: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  subscribeButton: {
    marginTop: 18,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 26,
    backgroundColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
  },
  footerLinks: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: '#8f8f8f',
    fontSize: 11,
  },
  footerDot: {
    color: '#8f8f8f',
    fontSize: 10,
  },
});
