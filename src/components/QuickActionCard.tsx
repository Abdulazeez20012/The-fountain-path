import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ iconName, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color="#2C3E50" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minWidth: 70,
    marginHorizontal: 5,
  },
  iconContainer: {
    marginBottom: 5,
  },
  title: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default QuickActionCard;