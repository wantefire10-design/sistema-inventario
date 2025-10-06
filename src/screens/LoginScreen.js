import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen({ navigation = {} }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      Alert.alert('✅ Éxito', '¡Bienvenido al Sistema!');
      // Navegación simple y directa
      setTimeout(() => {
        navigation.navigate('ProductList');
      }, 1000);
    } else {
      Alert.alert('❌ Error', 'Usuario: admin\nContraseña: password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Sistema de Inventario</Text>
      <Text style={styles.subtitle}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <View style={styles.helpBox}>
        <Text style={styles.helpText}>Usuario: admin</Text>
        <Text style={styles.helpText}>Contraseña: password</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddddddff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'blue',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e8f4fd',
    borderRadius: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});