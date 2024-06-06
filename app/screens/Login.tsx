import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, View, ImageBackground, TouchableOpacity } from 'react-native';
import styles from '../style';

const backgroundImage = { uri: "https://i.pinimg.com/736x/8c/e6/88/8ce68897df5720a305bb2415d52b0c68.jpg" };

type RootStackParamList = {

  Home: undefined;
  Login: undefined;
};

type LoginScreenProps = StackNavigationProp<RootStackParamList, 'Login'>;

type LoginScreenRoute = RouteProp<RootStackParamList, 'Login'>;

type LoginProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

function Login({ navigation }: LoginProps): React.JSX.Element {
  const [usuario, setUsuario] = useState('');

  const [contrasena, setContrasena] = useState('');

  const btnIngresarOnPress = function () {
    if (usuario && contrasena) {
      navigation.navigate('Home');
      return;
    }
    Alert.alert('Fallido', 'Datos incorrectos');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          <Text style={styles.textHeader}>Iniciar Sesión</Text>
          
          <TextInput style={styles.textInput} placeholder='Usuario' placeholderTextColor={'#828894'} onChangeText={u => setUsuario(u)} />
          
          <TextInput style={styles.textInput} placeholder='Contraseña' secureTextEntry={true} placeholderTextColor={'#828894'} onChangeText={p => setContrasena(p)} />
          
          
          <TouchableOpacity style={styles.button} onPress={btnIngresarOnPress}>
          
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default Login;
