import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ContentCardProps {
  id: string;
  title: string;
  type: string;
  category: string;
  thumbnail: string;
  onPress?: (id: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  id, 
  title, 
  type, 
  category, 
  thumbnail, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress?.(id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: thumbnail }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.type}>{type}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.7,
    height: 200,
    marginLeft: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: '#2C3E50',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  type: {
    fontSize: 12,
    color: '#F1C40F',
    textTransform: 'capitalize',
  },
});

export default ContentCard;