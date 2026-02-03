import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ASPECTS = [
  { id: '1:1', label: '1:1', w: 1, h: 1 },
  { id: '16:9', label: '16:9', w: 16, h: 9 },
  { id: '4:3', label: '4:3', w: 4, h: 3 },
  { id: '9:16', label: '9:16', w: 9, h: 16 },
];

 function AspectSelector() {
  const [selected, setSelected] = useState('1:1');

  const renderItem = ({ item }) => {
    const isActive = selected === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelected(item.id)}
        style={[styles.card, isActive && styles.cardActive]}
      >
        <View style={styles.previewBox}>
          {/* preview shape */}
          <View style={[styles.previewShape, getPreviewStyle(item.w, item.h)]} />
        </View>

        <Text style={[styles.label, isActive && styles.labelActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={ASPECTS}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={renderItem}
    />
  );
}
export default AspectSelector

// preview sizing helper
function getPreviewStyle(w, h) {
  // keep inside 36x36 area
  const max = 28;
  if (w === h) return { width: max, height: max };

  if (w > h) {
    const height = Math.round((max * h) / w);
    return { width: max, height };
  } else {
    const width = Math.round((max * w) / h);
    return { width, height: max };
  }
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
    gap: 12, // RN 0.71+; if not working, use ItemSeparatorComponent
  },
  card: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#312107',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActive: {
    borderColor: '#F5A623',
    borderWidth: 2,
  },
  previewBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#312107',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  previewShape: {
    backgroundColor: '#8A6A1B',
    borderRadius: 4,
  },
  label: {
    color: '#cfcfcf',
    fontSize: 18,
    fontWeight: '600',
  },
  labelActive: {
    color: '#F5A623',
  },
});
