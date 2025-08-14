import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PrayerTimeCardProps {
  name: string;
  time: string;
}

const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({ name, time }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    minWidth: 60,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  name: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  time: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default PrayerTimeCard;