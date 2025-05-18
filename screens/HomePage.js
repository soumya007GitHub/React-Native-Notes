import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Filter from '../components/Filter';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const scale = width / 375; // base width reference (iPhone 11 Pro)

const scaledFontSize = (size) => Math.round(size * scale);

export default function HomePage() {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('#All');

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (e) {
        console.log('Error loading notes:', e);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes();
    });

    loadNotes();

    return unsubscribe;
  }, [navigation]);

  const categories = [
    '#All',
    '#Journal',
    '#Meeting',
    '#ToDo',
    '#Projects',
    '#Study',
    '#Personal',
    '#Recipes',
    '#Expense',
    '#Travel',
  ];

  const filteredNotes =
    activeFilter === '#All'
      ? notes
      : notes.filter((note) => note.category === activeFilter.replace('#', ''));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Image
            style={styles.profileImage}
            source={require('../assets/profile-photo.png')}
          />
          <Text style={styles.welcomeBack}>Welcome Back</Text>
          <Text style={styles.userName}>Soumya 👋</Text>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Your Notes</Text>
        <Pressable onPress={() => navigation.navigate('WriteNote')}>
          <Ionicons name="add-circle-outline" size={40 * scale} color="black" />
        </Pressable>
      </View>

      {/* Filter Section */}
      <ScrollView
        style={styles.filterScroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {categories.map((category, index) => (
          <Pressable key={index} onPress={() => setActiveFilter(category)}>
            <Filter
              title={category}
              isActive={activeFilter === category}
              style={{ marginRight: 10 * scale }}
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Notes List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50, }}>
        <View style={styles.notesWrapper}>
          {filteredNotes.length > 0 ? (
            [...filteredNotes]
              .reverse()
              .map((note, index) => (
                <Card
                  key={index}
                  bgColor={getRandomColor(index)}
                  title={note.title}
                  date={note.date}
                  desc={note.desc}
                  icon={note.icon}
                />
              ))
          ) : (
            <View style={styles.noNotesContainer}>
              <Text style={styles.noNotesText}>No</Text>
              <Text style={styles.noNotesText}>Notes Found</Text>
              <Text style={styles.noNotesTitle}>
                Yet<Text style={{ color: '#d0ff45' }}>.</Text>
              </Text>
              <Text style={styles.noNotesText}>^_^</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05, // 5% padding
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.06,
    paddingBottom: height * 0.03,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: width * 0.1, // 10% screen width
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    borderWidth: 1,
    marginRight: 10 * scale,
  },
  welcomeBack: {
    marginRight: 5 * scale,
    fontWeight: '300',
    fontSize: scaledFontSize(17),
    color: 'gray',
  },
  userName: {
    fontWeight: '500',
    fontSize: scaledFontSize(17),
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height * 0.04,
    marginBottom: height * 0.015,
  },
  heroTitle: {
    fontSize: scaledFontSize(50),
    fontWeight: '300',
    // You can add fontFamily if you have loaded it properly
    // fontFamily: 'Raleway-Regular',
  },
  filterScroll: {
    marginBottom: 20 * scale,
    minHeight: 55 * scale,
    maxHeight: 55 * scale,
  },
  notesWrapper: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'
  },
  noNotesContainer: {
    marginTop: '20%',
    alignItems: 'left',
  },
  noNotesText: {
    color: 'gray',
    fontSize: scaledFontSize(40),
    // fontFamily: 'Raleway-Regular',
  },
  noNotesTitle: {
    color: 'black',
    fontSize: scaledFontSize(80),
    // fontFamily: 'Raleway-Regular',
  },
});

// Card colors
const colors = ['#d1b1f9', '#a3ff95', '#b7e1f8', '#ffd6a5', '#ffadad'];

const getRandomColor = (index) => {
  return colors[index % colors.length];
};
