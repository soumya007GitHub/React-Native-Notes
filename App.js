import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from './screens/HomePage';
import OpenNote from './screens/OpenNote';
import WriteNote from './screens/WriteNote';
import EditNote from './screens/EditNote';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='HomePage' screenOptions={{headerShown: false,}}>
        <Stack.Screen
          name="HomePage"
          component={HomePage}
        />
        <Stack.Screen name="OpenNote" component={OpenNote} />
        <Stack.Screen name="WriteNote" component={WriteNote} />
        <Stack.Screen name="EditNote" component={EditNote} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App