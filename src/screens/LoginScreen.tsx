import {useState} from 'react';
import {useAuth} from "../context/AuthContext.tsx";
import {Pressable, Text, TextInput, View } from 'react-native';

interface Props {
    onRegister:()=>void;
}

export const LoginScreen=({onRegister}:Props)=>{
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading] = useState<boolean>(false);
    const {login} = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            //TODO Alert
            return;
        }
        try {

        } catch (error){
            setLoading(true);
            await login(username, password);
        } finally {
            setLoading(false);
        }
    }
    return (
      <View>
        <Text>Login</Text>
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
        <Pressable onPress={handleLogin} disabled={loading}>
          <Text>{loading ? 'Authorization...' : 'Login'}</Text>
        </Pressable>
        <Pressable onPress={onRegister}>
          <Text>Register</Text>
        </Pressable>
      </View>
    );
}