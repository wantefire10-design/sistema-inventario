import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Necesario para guardar el token
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// URL de tu API. ¡IMPORTANTE! Usa la IP de tu computadora, no 'localhost'.
const API_URL = 'http://10.140.226.149:3000/api';

export default function TabOneScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para manejar la sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null); // <-- Almacena el token
  const [userRole, setUserRole] = useState<string | null>(null);   // <-- Almacena el rol del usuario

  // Estados para manejar los datos
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para verificar si ya existe un token al abrir la app
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      if (token && role) {
        setAuthToken(token);
        setUserRole(role);
        setIsLoggedIn(true);
      }
    };
    checkToken();
  }, []);

  // Efecto para cargar productos cuando el estado de login cambia
  useEffect(() => {
    if (isLoggedIn && authToken) {
      fetchProductos(authToken);
    }
  }, [isLoggedIn, authToken]);

  const fetchProductos = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/productos`, {
        headers: {
          // <-- Envía el token para autorización
          'Authorization': `Bearer ${token}` 
        }
      });
      if (!response.ok) throw new Error('Error al obtener los productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Error', 'No se pudieron cargar los productos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // --- LÓGICA CORREGIDA ---
      // La línea clave del cambio está aquí:
      // Ya no buscamos 'rol', lo deducimos del 'username'.
      const userRole = data.user.username === 'admin' ? 'admin' : 'usuario';

      // Solo procedemos si tenemos un token Y un usuario
      if (data.token && data.user) {
        await AsyncStorage.setItem('userToken', data.token);
        // Guardamos el rol que acabamos de deducir
        await AsyncStorage.setItem('userRole', userRole); 
        
        setAuthToken(data.token);
        setUserRole(userRole);
        setIsLoggedIn(true);
        
        Alert.alert('✅ Éxito', `¡Bienvenido ${data.user.nombre}!`);
      } else {
        Alert.alert('❌ Error de Respuesta', 'La respuesta del servidor no contiene los datos esperados.');
      }
    } else {
      Alert.alert('❌ Error de Autenticación', data.message || 'Credenciales incorrectas');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('❌ Error de Conexión', 'No se pudo conectar con el servidor.');
  }
};

  const handleLogout = async () => {
    // Limpia el almacenamiento y los estados
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setAuthToken(null);
    setUserRole(null);
    setUsername('');
    setPassword('');
    setProductos([]);
  };

  // --- LÓGICA PARA EDITAR Y ELIMINAR (PLACEHOLDERS) ---
  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => {
            // Aquí iría la lógica fetch DELETE a /productos/:id
            console.log(`Eliminar producto con ID: ${id}`);
            // Después de eliminar, volver a cargar los productos
            if (authToken) fetchProductos(authToken);
          }
        }
      ]
    );
  };
  
  const handleEdit = (producto: any) => {
      // Aquí abrirías un Modal o navegarías a otra pantalla para editar
      Alert.alert("Editar Producto", `Editar ${producto.nombre}`);
      console.log("Editando:", producto);
  };

  // SI ESTÁ LOGUEADO: Mostrar productos
  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📦 Inventario</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
        ) : (
          <ScrollView style={styles.productList}>
            {productos.map((producto: any) => (
              <View key={producto.id} style={styles.productCard}>
                <View>
                  <Text style={styles.productName}>{producto.nombre}</Text>
                  <Text style={styles.productPrice}>${producto.precio}</Text>
                  <Text style={styles.productStock}>Stock: {producto.stock} unidades</Text>
                  {/* Campo actualizado de la API */}
                  <Text style={styles.productCategory}>{producto.categoria_nombre ?? 'Sin categoría'}</Text>
                </View>

                {/* --- BOTONES DE ACCIÓN SOLO PARA ADMINS --- */}
                {userRole === 'admin' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(producto)}>
                      <Text style={styles.actionButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(producto.id)}>
                      <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        {/* --- BOTÓN PARA AGREGAR PRODUCTO (SOLO ADMINS) --- */}
        {userRole === 'admin' && (
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Agregar Producto</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // SI NO ESTÁ LOGUEADO: Mostrar login
  return (
      // ... El JSX del Login no cambia ...
    <View style={styles.loginContainer}>
      <Text style={styles.title}>🔐 Sistema de Inventario</Text>
      <Text style={styles.subtitle}>Iniciar Sesión</Text>
      <Text style={styles.subtitle}> Francisco Javier Montero Ochoa </Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
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
    </View>
  );
}

// --- ESTILOS ACTUALIZADOS ---
const styles = StyleSheet.create({
  // ... (Estilos de loginContainer, container, header, etc. siguen iguales)
  productCard: {
    // ... (Estilo anterior)
    flexDirection: 'row', // <-- Nuevo
    justifyContent: 'space-between', // <-- Nuevo
    alignItems: 'center', // <-- Nuevo
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  // ... (El resto de tus estilos)
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
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
    width: '100%',
    maxWidth: 300,
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
  productList: {
    flex: 1,
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