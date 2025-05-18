import { Pressable, Text, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const scale = width / 375; // Base width from iPhone 11 Pro

const scaledSize = (size) => Math.round(size * scale);

const Card = ({ bgColor, icon, title, date, desc }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={[styles.pressable, { backgroundColor: bgColor }]}
      onPress={() =>
        navigation.navigate('OpenNote', {
          title: title,
          date: date,
          desc: desc,
          icon: icon,
          bgColor: bgColor,
        })
      }
    >
      <Text style={styles.text1}>{title}</Text>
      <Text style={styles.text2}>{date}</Text>
      <Text style={styles.text2}>{desc}</Text>
      <Ionicons name={icon} size={scaledSize(30)} color="black" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#000',
    padding: scaledSize(10),
    borderRadius: scaledSize(20),
    marginBottom: scaledSize(20),
    elevation: 8,
  },
  text1: {
    fontSize: scaledSize(20),
    fontFamily: 'Raleway-Regular',
  },
  text2: {
    fontSize: scaledSize(13),
    marginBottom: scaledSize(20),
    color: '#4a4a4a',
  },
});

export default Card;
