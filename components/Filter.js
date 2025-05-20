import { Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 375; // 375 is a common base width (iPhone 11)

const Filter = ({ title, isActive }) => {
  return (
    <Text
      style={[
        styles.text,
        {
          backgroundColor: isActive ? '#d0ff45' : '#fff',
        },
      ]}
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 10 * scale,
    paddingVertical: 5 * scale,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10 * scale,
    marginRight: 6 * scale,
    fontSize: 14 * scale,
  },
});

export default Filter;
