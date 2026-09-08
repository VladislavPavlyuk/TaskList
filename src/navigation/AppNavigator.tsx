import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {LoginScreen} from '../screens/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import TasksScreen from '../screens/TasksScreen';

export type RootStackParamList = {
  Tasks: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const {accessToken, tokenLoading} = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (tokenLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (accessToken) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Tasks"
          component={TasksScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  if (showRegister) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Register" options={{headerShown: false}}>
          {() => <RegisterScreen onLogin={() => setShowRegister(false)} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{headerShown: false}}>
        {() => <LoginScreen onRegister={() => setShowRegister(true)} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
