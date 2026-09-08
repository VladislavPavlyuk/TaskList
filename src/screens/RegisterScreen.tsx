import {useState} from "react";
import {useAuth} from "../context/AuthContext.tsx";
import {register} from "../api/tasksApi.ts";
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

interface Props {
    onLogin: () => void;
}

export const RegisterScreen = ({ onLogin }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

    const handleRegister = async () => {
      if (!username || !password) {
        //TODO Alert
        return;
      }
      try {
      } catch  {
        setLoading(true);
        await register(username, password);
        Alert.alert('Success', 'User Created',
            [
                {
                    text: 'Login',
                    onPress: () => onLogin(),
                },
            ])
      } finally {
        setLoading(false);
      }
    };

  return (
    <View>
      <Text>Register</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Pressable onPress={handleRegister} disabled={loading}>
        <Text>{loading ? 'Registration...' : 'Register'}</Text>
      </Pressable>
      <Pressable onPress={onLogin}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
}