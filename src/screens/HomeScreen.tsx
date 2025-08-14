import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuickActionCard from '../components/QuickActionCard';
import ContentCard from '../components/ContentCard';
import PrayerTimeCard from '../components/PrayerTimeCard';
import DailyVerseCard from '../components/DailyVerseCard';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  category: string;
  thumbnail: string;
}

interface HomeScreenProps {
  navigation?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [featuredContent, setFeaturedContent] = useState<ContentItem[]>([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadUserData();
    loadFeaturedContent();
    setGreetingBasedOnTime();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // Set default user if none exists
        const defaultUser = { name: 'Seeker', joinDate: new Date().toISOString() };
        setUser(defaultUser);
        await AsyncStorage.setItem('user', JSON.stringify(defaultUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser({ name: 'Seeker' });
    }
  };

  const loadFeaturedContent = async () => {
    try {
      // Mock data - replace with API call
      const content = [
        {
          id: '1',
          title: 'The Spiritual Journey',
          type: 'article',
          category: 'spirituality',
          thumbnail: 'https://images.unsplash.com/photo-1665317339483-9b8ec1f3234b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxtb3NxdWUlMjBzdW5zZXQlMjBzcGlyaXR1YWwlMjBhcmNoaXRlY3R1cmV8ZW58MHwwfHxvcmFuZ2V8MTc1NTE2NDIzMXww&ixlib=rb-4.1.0&q=85',
        },
        {
          id: '2',
          title: 'Daily Prayers Guide',
          type: 'prayer',
          category: 'prayers',
          thumbnail: 'https://images.unsplash.com/photo-1664938785442-85f4f77e560a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxwcmF5ZXIlMjBoYW5kcyUyMG1lZGl0YXRpb24lMjBzcGlyaXR1YWx8ZW58MHwxfHxibHVlfDE3NTUxNjQyMzF8MA&ixlib=rb-4.1.0&q=85',
        },
        {
          id: '3',
          title: 'Understanding Quran',
          type: 'lecture',
          category: 'quran',
          thumbnail: 'https://images.unsplash.com/photo-1585255366830-8697e9c7d263?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxxdXJhbiUyMGJvb2slMjBhcmFiaWMlMjBjYWxsaWdyYXBoeXxlbnwwfDB8fHllbGxvd3wxNzU1MTY0MjMxfDA&ixlib=rb-4.1.0&q=85',
        },
      ];
      setFeaturedContent(content);
    } catch (error) {
      console.error('Error loading featured content:', error);
    }
  };

  const setGreetingBasedOnTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const handleContentPress = (contentId: string) => {
    Alert.alert('Content Selected', `Opening content: ${contentId}`);
    // navigation?.navigate('ContentDetail', { contentId });
  };

  const handleQuickAction = (action: string) => {
    Alert.alert('Quick Action', `${action} selected`);
  };

  const prayerTimes = [
    { name: 'Fajr', time: '5:30 AM' },
    { name: 'Dhuhr', time: '1:15 PM' },
    { name: 'Asr', time: '4:45 PM' },
    { name: 'Maghrib', time: '7:20 PM' },
    { name: 'Isha', time: '8:45 PM' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {greeting}, {user?.name || 'Seeker'}
            </Text>
            <Text style={styles.subtitle}>Welcome to your spiritual journey</Text>
          </View>
          
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color="#F1C40F" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
          >
            <QuickActionCard 
              iconName="book" 
              title="Read" 
              onPress={() => handleQuickAction('Read')}
            />
            <QuickActionCard 
              iconName="chatbubble" 
              title="Chat" 
              onPress={() => handleQuickAction('Chat')}
            />
            <QuickActionCard 
              iconName="calendar" 
              title="Events" 
              onPress={() => handleQuickAction('Events')}
            />
            <QuickActionCard 
              iconName="heart" 
              title="Donate" 
              onPress={() => handleQuickAction('Donate')}
            />
          </ScrollView>
        </View>

        {/* Featured Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Content</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredScroll}
          >
            {featuredContent.map((item) => (
              <ContentCard
                key={item.id}
                {...item}
                onPress={handleContentPress}
              />
            ))}
          </ScrollView>
        </View>

        {/* Daily Verse */}
        <View style={styles.section}>
          <DailyVerseCard
            verse="And whoever puts their trust in Allah, then He will suffice him."
            reference="Quran 65:3"
          />
        </View>

        {/* Prayer Times */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Prayer Times</Text>
          <View style={styles.prayerTimesContainer}>
            {prayerTimes.map((prayer) => (
              <PrayerTimeCard
                key={prayer.name}
                name={prayer.name}
                time={prayer.time}
              />
            ))}
          </View>
        </View>
      </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#BDC3C7',
    marginTop: 5,
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  quickActionsContainer: {
    paddingHorizontal: 15,
  },
  featuredScroll: {
    marginHorizontal: -20,
  },
  prayerTimesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;