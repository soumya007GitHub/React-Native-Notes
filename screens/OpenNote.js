import { View, Text, StyleSheet, Pressable, Alert, Dimensions, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OpenNote = ({ route }) => {
  const { title, date, desc, icon, bgColor } = route.params;
  const navigation = useNavigation();

  const deleteNote = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('notes');
      let notes = jsonValue != null ? JSON.parse(jsonValue) : [];
      const updatedNotes = notes.filter(note => note.title !== title);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      navigation.goBack();
    } catch (e) {
      console.error('Error deleting note:', e);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteNote },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View>
          <Text style={[styles.title, { fontSize: width * 0.1 }]}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
          <View style={[styles.body, { backgroundColor: bgColor }]}>
            <Text style={[styles.desc, { fontSize: width * 0.04 }]}>{desc}</Text>
            <Ionicons name={icon} size={30} color="black" style={{ marginTop: 10 }} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('EditNote', {
              title,
              date,
              desc,
              icon,
              bgColor
            })}
          >
            <Ionicons name="create-outline" size={30} color="black" />
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={confirmDelete}
          >
            <Ionicons name="trash-outline" size={30} color="black" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '300',
    marginBottom: 10,
  },
  date: {
    color: 'gray',
    marginBottom: 10,
  },
  desc: {
    marginBottom: 20,
  },
  body: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '47%',
    backgroundColor: '#d0ff45',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
});

export default OpenNote;
