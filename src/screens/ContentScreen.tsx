import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'book';
  category: string;
  description: string;
  thumbnail: string;
  duration?: string;
  author: string;
}

const ContentScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);

  const categories = [
    { id: 'all', label: 'All Content' },
    { id: 'quran', label: 'Quran' },
    { id: 'hadith', label: 'Hadith' },
    { id: 'prayers', label: 'Prayers' },
    { id: 'spirituality', label: 'Spirituality' },
    { id: 'history', label: 'History' },
  ];

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [searchQuery, selectedCategory, contentItems]);

  const loadContent = () => {
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'The Spiritual Journey',
        type: 'article',
        category: 'spirituality',
        description: 'Explore the path to spiritual enlightenment and inner peace through Islamic teachings.',
        thumbnail: 'https://images.unsplash.com/photo-1665317339483-9b8ec1f3234b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxtb3NxdWUlMjBzdW5zZXQlMjBzcGlyaXR1YWwlMjBhcmNoaXRlY3R1cmV8ZW58MHwwfHxvcmFuZ2V8MTc1NTE2NDIzMXww&ixlib=rb-4.1.0&q=85',
        author: 'Dr. Ahmad Hassan',
      },
      {
        id: '2',
        title: 'Daily Prayers Guide',
        type: 'book',
        category: 'prayers',
        description: 'A comprehensive guide to daily prayers and their significance in Islamic practice.',
        thumbnail: 'https://images.unsplash.com/photo-1664938785442-85f4f77e560a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxwcmF5ZXIlMjBoYW5kcyUyMG1lZGl0YXRpb24lMjBzcGlyaXR1YWx8ZW58MHwxfHxibHVlfDE3NTUxNjQyMzF8MA&ixlib=rb-4.1.0&q=85',
        author: 'Sheikh Abdullah',
      },
      {
        id: '3',
        title: 'Understanding Quran',
        type: 'video',
        category: 'quran',
        description: 'Deep dive into Quranic verses and their meanings for modern life.',
        thumbnail: 'https://images.unsplash.com/photo-1585255366830-8697e9c7d263?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxxdXJhbiUyMGJvb2slMjBhcmFiaWMlMjBjYWxsaWdyYXBoeXxlbnwwfDB8fHllbGxvd3wxNzU1MTY0MjMxfDA&ixlib=rb-4.1.0&q=85',
        duration: '45 min',
        author: 'Imam Muhammad',
      },
      {
        id: '4',
        title: 'Prophetic Traditions',
        type: 'audio',
        category: 'hadith',
        description: 'Listen to authentic Hadith and their explanations.',
        thumbnail: 'https://images.unsplash.com/photo-1665317339483-9b8ec1f3234b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxtb3NxdWUlMjBzdW5zZXQlMjBzcGlyaXR1YWwlMjBhcmNoaXRlY3R1cmV8ZW58MHwwfHxvcmFuZ2V8MTc1NTE2NDIzMXww&ixlib=rb-4.1.0&q=85',
        duration: '30 min',
        author: 'Dr. Fatima Ali',
      },
      {
        id: '5',
        title: 'Islamic History',
        type: 'article',
        category: 'history',
        description: 'Learn about the rich history of Islam and its contributions to civilization.',
        thumbnail: 'https://images.unsplash.com/photo-1585255366830-8697e9c7d263?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxxdXJhbiUyMGJvb2slMjBhcmFiaWMlMjBjYWxsaWdyYXBoeXxlbnwwfDB8fHllbGxvd3wxNzU1MTY0MjMxfDA&ixlib=rb-4.1.0&q=85',
        author: 'Prof. Sarah Ahmed',
      },
    ];
    
    setContentItems(mockContent);
  };

  const filterContent = () => {
    let filtered = contentItems;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredContent(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return 'play-circle';
      case 'audio':
        return 'musical-notes';
      case 'book':
        return 'book';
      case 'article':
      default:
        return 'document-text';
    }
  };

  const handleContentPress = (item: ContentItem) => {
    Alert.alert(
      item.title,
      `Type: ${item.type}\nAuthor: ${item.author}\n\n${item.description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log('Opening content:', item.id) },
      ]
    );
  };

  const renderContentItem = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity 
      style={styles.contentCard} 
      onPress={() => handleContentPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.contentImage} />
      <View style={styles.contentInfo}>
        <View style={styles.contentHeader}>
          <View style={styles.typeContainer}>
            <Ionicons 
              name={getTypeIcon(item.type) as any} 
              size={16} 
              color="#2C3E50" 
            />
            <Text style={styles.typeText}>{item.type}</Text>
            {item.duration && (
              <Text style={styles.durationText}>{item.duration}</Text>
            )}
          </View>
        </View>
        
        <Text style={styles.contentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.authorText}>By {item.author}</Text>
        
        <Text style={styles.descriptionText} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category: { id: string; label: string }) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(category.id)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category.id && styles.selectedCategoryButtonText
      ]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Content Library</Text>
        <Text style={styles.headerSubtitle}>Discover spiritual content to enrich your journey</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#7F8C8D" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search content..."
            placeholderTextColor="#7F8C8D"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#7F8C8D" />
            </TouchableOpacity>
          )}
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredContent.length} item{filteredContent.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <FlatList
        data={filteredContent}
        renderItem={renderContentItem}
        keyExtractor={(item) => item.id}
        style={styles.contentList}
        contentContainerStyle={styles.contentListContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color="#BDC3C7" />
            <Text style={styles.emptyText}>No content found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3',
  },
  header: {
    backgroundColor: '#2C3E50',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BDC3C7',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 12,
  },
  categoriesContainer: {
    marginHorizontal: -20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCategoryButton: {
    backgroundColor: '#2C3E50',
    borderColor: '#2C3E50',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultsText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  contentList: {
    flex: 1,
  },
  contentListContainer: {
    padding: 20,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  contentImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  contentInfo: {
    padding: 15,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  durationText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 10,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  authorText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 5,
  },
});

export default ContentScreen;