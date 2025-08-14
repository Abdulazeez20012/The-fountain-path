import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStats {
  articlesRead: number;
  prayersCompleted: number;
  streakDays: number;
  totalPoints: number;
}

interface UserSettings {
  notifications: boolean;
  prayerReminders: boolean;
  darkMode: boolean;
}

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState({
    name: 'Ahmad Hassan',
    email: 'ahmad.hassan@example.com',
    joinDate: 'January 2024',
  });

  const [stats, setStats] = useState<UserStats>({
    articlesRead: 45,
    prayersCompleted: 120,
    streakDays: 15,
    totalPoints: 850,
  });

  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    prayerReminders: true,
    darkMode: false,
  });

  useEffect(() => {
    loadUserData();
    loadSettings();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      const userStats = await AsyncStorage.getItem('userStats');
      if (userStats) {
        setStats(JSON.parse(userStats));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const userSettings = await AsyncStorage.getItem('userSettings');
      if (userSettings) {
        setSettings(JSON.parse(userSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingChange = async (setting: keyof UserSettings) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user');
              Alert.alert('Success', 'You have been logged out.');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }
        },
      ]
    );
  };

  const achievements = [
    { title: 'First Steps', description: 'Completed your first reading', earned: true },
    { title: 'Consistent Reader', description: 'Read for 7 consecutive days', earned: true },
    { title: 'Prayer Warrior', description: 'Completed 100 prayers', earned: true },
    { title: 'Knowledge Seeker', description: 'Read 50 articles', earned: false },
  ];

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={32} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const AchievementCard = ({ title, description, earned }: { title: string; description: string; earned: boolean }) => (
    <View style={[styles.achievementCard, !earned && styles.achievementCardLocked]}>
      <View style={styles.achievementHeader}>
        <Text style={[styles.achievementTitle, !earned && styles.achievementTitleLocked]}>
          {title}
        </Text>
        {earned && (
          <View style={styles.earnedBadge}>
            <Text style={styles.earnedText}>✓</Text>
          </View>
        )}
      </View>
      <Text style={[styles.achievementDescription, !earned && styles.achievementDescriptionLocked]}>
        {description}
      </Text>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onToggle, 
    showSwitch = true 
  }: { 
    icon: string; 
    title: string; 
    subtitle: string; 
    value?: boolean; 
    onToggle?: () => void;
    showSwitch?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onToggle} disabled={!showSwitch}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#2C3E50" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E0E0E0', true: '#2C3E50' }}
          thumbColor={value ? '#F1C40F' : '#FFFFFF'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color="#2C3E50" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
            <StatCard title="Articles Read" value={stats.articlesRead} icon="book" color="#3498DB" />
            <StatCard title="Prayers Completed" value={stats.prayersCompleted} icon="heart" color="#E74C3C" />
            <StatCard title="Day Streak" value={stats.streakDays} icon="flame" color="#F39C12" />
            <StatCard title="Total Points" value={stats.totalPoints} icon="trophy" color="#27AE60" />
          </ScrollView>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <AchievementCard key={index} {...achievement} />
            ))}
          </ScrollView>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle="Receive app notifications"
              value={settings.notifications}
              onToggle={() => handleSettingChange('notifications')}
            />
            <SettingItem
              icon="time"
              title="Prayer Reminders"
              subtitle="Get notified for prayer times"
              value={settings.prayerReminders}
              onToggle={() => handleSettingChange('prayerReminders')}
            />
            <SettingItem
              icon="moon"
              title="Dark Mode"
              subtitle="Switch to dark theme"
              value={settings.darkMode}
              onToggle={() => handleSettingChange('darkMode')}
            />
            <SettingItem
              icon="language"
              title="Language"
              subtitle="English"
              showSwitch={false}
            />
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="#E74C3C" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34495E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#BDC3C7',
    marginBottom: 3,
  },
  joinDate: {
    fontSize: 14,
    color: '#95A5A6',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1C40F',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#2C3E50',
    fontWeight: '600',
    marginLeft: 5,
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
  statsContainer: {
    paddingLeft: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginRight: 15,
    minWidth: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  achievementsContainer: {
    paddingLeft: 20,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    width: 200,
    borderWidth: 2,
    borderColor: '#F1C40F',
  },
  achievementCardLocked: {
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  achievementTitleLocked: {
    color: '#7F8C8D',
  },
  earnedBadge: {
    backgroundColor: '#F1C40F',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedText: {
    color: '#2C3E50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  achievementDescriptionLocked: {
    color: '#BDC3C7',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
    marginLeft: 15,
  },
});

export default ProfileScreen;