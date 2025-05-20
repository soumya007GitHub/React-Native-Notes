import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const EditNote = ({ route }) => {
  const { title, date, desc, icon } = route.params;

  const getCategoryFromIcon = (icon) => {
    switch (icon) {
      case 'newspaper-outline': return 'Journal';
      case 'people-outline': return 'Meeting';
      case 'trophy-outline': return 'ToDo';
      case 'hammer-outline': return 'Projects';
      case 'book-outline': return 'Study';
      case 'heart-outline': return 'Personal';
      case 'fast-food-outline': return 'Recipes';
      case 'cash-outline': return 'Expense';
      case 'airplane-outline': return 'Travel';
      default: return '';
    }
  };

  const getIconFromCategory = (category) => {
    switch (category) {
      case 'Journal': return 'newspaper-outline';
      case 'Meeting': return 'people-outline';
      case 'ToDo': return 'trophy-outline';
      case 'Projects': return 'hammer-outline';
      case 'Study': return 'book-outline';
      case 'Personal': return 'heart-outline';
      case 'Recipes': return 'fast-food-outline';
      case 'Expense': return 'cash-outline';
      case 'Travel': return 'airplane-outline';
      default: return '';
    }
  };

  const [editTitle, setEditTitle] = useState(title);
  const [editDesc, setEditDesc] = useState(desc);
  const [editSelectedCategory, setEditSelectedCategory] = useState(getCategoryFromIcon(icon));
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadNotes = async () => {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    };
    loadNotes();
  }, []);

  const saveNote = async () => {
    if (!editTitle.trim() || !editDesc.trim()) return;
    try {
      const updatedNotes = notes.map((note) => {
        if (note.title === title && note.date === date) {
          return {
            title: editTitle.trim(),
            desc: editDesc.trim(),
            category: editSelectedCategory,
            icon: getIconFromCategory(editSelectedCategory),
            date: date,
          };
        }
        return note;
      });

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      navigation.navigate('HomePage');
    } catch (e) {
      console.log('Failed to update note:', e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar style="dark" />
          <Text style={styles.header}>Edit Note</Text>

          <TextInput
            style={styles.titleInput}
            onChangeText={setEditTitle}
            value={editTitle}
            placeholder="Title"
            multiline={true}
          />

          <TextInput
            style={styles.descInput}
            onChangeText={setEditDesc}
            value={editDesc}
            placeholder="Description"
            multiline={true}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editSelectedCategory}
              onValueChange={(itemValue) => setEditSelectedCategory(itemValue)}
              prompt="Select Category"
            >
              <Picker.Item label="Journal" value="Journal" />
              <Picker.Item label="Meeting" value="Meeting" />
              <Picker.Item label="ToDo" value="ToDo" />
              <Picker.Item label="Projects" value="Projects" />
              <Picker.Item label="Study" value="Study" />
              <Picker.Item label="Personal" value="Personal" />
              <Picker.Item label="Recipes" value="Recipes" />
              <Picker.Item label="Expense" value="Expense" />
              <Picker.Item label="Travel" value="Travel" />
            </Picker>
          </View>

          <View style={styles.date}>
            <Text>Date: {date}</Text>
          </View>
        </ScrollView>

        <Pressable style={styles.submitButton} onPress={saveNote}>
          <Text style={{ fontWeight: 'bold' }}>Save Changes</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.02,
  },
  header: {
    fontSize: width * 0.1,
    marginBottom: height * 0.03,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: width * 0.02,
    height: height * 0.06,
  },
  descInput: {
    marginTop: height * 0.015,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.02,
    height: height * 0.25,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    marginTop: height * 0.015,
    borderRadius: 10,
  },
  date: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: width * 0.03,
    marginTop: height * 0.015,
  },
  submitButton: {
    width: '90%',
    backgroundColor: '#d0ff45',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
});

export default EditNote;
