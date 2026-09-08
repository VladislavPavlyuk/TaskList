import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useAuth} from "../context/AuthContext.tsx"
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import TasksScreen from '../screens/TasksScreen.tsx';
import {RegisterScreen} from "../screens/RegisterScreen.tsx";
import {LoginScreen} from "../screens/LoginScreen.tsx";

const Stack = createNativeStackNavigator();

export const AppNavigator =()=>{
    const {accessToken, tokenLoading} = useAuth();
    const [showRegister, setShowRegister] = useState(false);
    if (tokenLoading){
        return (
            <View>
                <ActivityIndicator
                    size={"large"}
                />
            </View>
        )
    }
    if (accessToken !== '' && !accessToken){
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name = "Tasks"
                    component={TasksScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        )
    }

    if (showRegister) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="Register"
            component={TasksScreen}
            options={{
              headerShown: false,
            }}
          >
              {() => (
                  <RegisterScreen
                  onLogin={()=>setShowRegister(false)}
                  />
              )}
              </Stack.Screen>
        </Stack.Navigator>
      );
    }

    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={TasksScreen}
          options={{
            headerShown: false,
          }}
        >
          {() => <LoginScreen onRegister={() => setShowRegister(true)} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
};
