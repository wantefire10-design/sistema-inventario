import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function TabOneScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Datos de productos
  const productos = [
    { id: 1, nombre: 'Laptop HP', precio: 12500, stock: 15, categoria: 'Electrónicos' },
    { id: 2, nombre: 'Mouse Inalámbrico', precio: 450.50, stock: 25, categoria: 'Electrónicos' },
    { id: 3, nombre: 'Resma de Papel A4', precio: 280, stock: 8, categoria: 'Oficina' },
    { id: 4, nombre: 'Monitor 24"', precio: 3500, stock: 10, categoria: 'Electrónicos' },
    { id: 5, nombre: 'Silla Oficina', precio: 1800, stock: 12, categoria: 'Muebles' },
    { id: 6, nombre: 'Teclado Mecánico', precio: 1200, stock: 18, categoria: 'Electrónicos' },
  ];

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      Alert.alert('✅ Éxito', '¡Bienvenido al Sistema!');
      setIsLoggedIn(true);
    } else {
      Alert.alert('❌ Error', 'Usuario: admin\nContraseña: password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // SI ESTÁ LOGUEADO: Mostrar productos
  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📦 Sistema de Inventario</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.productList}>
          {productos.map((producto) => (
            <View key={producto.id} style={styles.productCard}>
              <Text style={styles.productName}>{producto.nombre}</Text>
              <Text style={styles.productPrice}>${producto.precio}</Text>
              <Text style={styles.productStock}>Stock: {producto.stock} unidades</Text>
              <Text style={styles.productCategory}>{producto.categoria}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Agregar Producto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // SI NO ESTÁ LOGUEADO: Mostrar login CENTRADO
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.subtitle}>Jose Manuel</Text>
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
  // CONTENEDOR PARA LOGIN (CENTRADO)
  loginContainer: {
    flex: 1,
    justifyContent: 'center',    // ← CENTRADO VERTICAL
    alignItems: 'center',       // ← CENTRADO HORIZONTAL  
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  // CONTENEDOR PARA PRODUCTOS (NORMAL)
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
    width: '100%',  // ← ANCHO COMPLETO
    maxWidth: 300,  // ← ANCHO MÁXIMO
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    maxWidth: 300,
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
    width: '100%',
    maxWidth: 300,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  productList: {
    flex: 1,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
  productStock: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});