import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DailyVerseCardProps {
  verse: string;
  reference: string;
}

const DailyVerseCard: React.FC<DailyVerseCardProps> = ({ verse, reference }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.verse}>{verse}</Text>
      <Text style={styles.reference}>{reference}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1C40F',
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginHorizontal: 20,
  },
  verse: {
    fontSize: 16,
    color: '#2C3E50',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  reference: {
    fontSize: 14,
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
});

export default DailyVerseCard;