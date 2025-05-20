import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const WriteNote = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Journal');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      const d = new Date();
      const todaysDate = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
      setDate(todaysDate);

      try {
        const savedNotes = await AsyncStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (e) {
        console.log('Failed to load notes:', e);
      }
    };

    loadNotes();
  }, []);

  const saveNote = async () => {
    if (!title.trim() || !desc.trim()) {
      Alert.alert('Empty fields detected :(', 'Please enter both title and description.');
      return;
    }

    let categoryIcon = '';
    switch(selectedCategory){
      case 'Journal': categoryIcon = 'newspaper-outline'; break;
      case 'Meeting': categoryIcon = 'people-outline'; break;
      case 'ToDo': categoryIcon = 'trophy-outline'; break;
      case 'Projects': categoryIcon = 'hammer-outline'; break;
      case 'Study': categoryIcon = 'book-outline'; break;
      case 'Personal': categoryIcon = 'heart-outline'; break;
      case 'Recipes': categoryIcon = 'fast-food-outline'; break;
      case 'Expense': categoryIcon = 'cash-outline'; break;
      case 'Travel': categoryIcon = 'airplane-outline'; break;
      default: categoryIcon = ''; 
    }

    const newNote = { 
      title: title.trim(), 
      desc: desc.trim(), 
      category: selectedCategory,
      icon: categoryIcon,
      date 
    };

    try {
      const existingNotes = await AsyncStorage.getItem('notes');
      let parsedNotes = [];

      if (existingNotes !== null) {
        parsedNotes = JSON.parse(existingNotes);
      }

      const updatedNotes = [...parsedNotes, newNote];

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

      setNotes(updatedNotes);
      setTitle('');
      setDesc('');
      setSelectedCategory('Journal');  // Reset to default category
      navigation.navigate('HomePage');
    } catch (e) {
      console.log('Failed to save note:', e);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <StatusBar style="dark" />
        <View>
          <Text style={styles.header}>Add Note</Text>

          {/* Title */}
          <TextInput
            style={styles.titleInput}
            onChangeText={setTitle}
            value={title}
            placeholder='Title'
            multiline={true}
          />

          {/* Description */}
          <TextInput
            style={styles.descInput}
            onChangeText={setDesc}
            value={desc}
            placeholder='Description'
            multiline={true}
          />

          {/* Category Selector */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              prompt="Select Category"
              style={{ width: '100%' }}
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

          {/* Today's Date */}
          <View style={styles.date}>
            <Text>Date: {date}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          style={styles.submitButton}
          onPress={saveNote}
        >
          <Text style={{ fontWeight: 'bold' }}>Submit</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingTop: height * 0.06,
    paddingBottom: height * 0.05,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  header: {
    fontSize: width * 0.12,
    marginBottom: height * 0.04,
    fontWeight: '300',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 50,
    fontSize: width * 0.045,
  },
  descInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: height * 0.25,
    fontSize: width * 0.045,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 12,
    borderRadius: 10,
    overflow: 'hidden'
  },
  date: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    fontSize: width * 0.04
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#d0ff45',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 20
  }
});

export default WriteNote;
