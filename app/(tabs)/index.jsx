import { productService } from '@/src/services/api';
import { useEffect, useState } from 'react';
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
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // CARGAR PRODUCTOS DEL BACKEND
  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getAll();
      setProductos(productsData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // CREAR PRODUCTO
  const createProduct = async () => {
    try {
      const newProduct = {
        codigo: 'PROD' + Date.now(),
        nombre: 'Nuevo Producto ' + Date.now(),
        descripcion: 'Producto creado desde la app',
        precio_compra: 100,
        precio_venta: 150,
        stock: 10,
        stock_minimo: 5,
        categoria_id: 1
      };
      
      await productService.create(newProduct);
      await loadProducts();
      Alert.alert('Éxito', 'Producto creado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el producto');
      console.error(error);
    }
  };

  // ACTUALIZAR PRODUCTO
  const updateProduct = async (id) => {
    try {
      const updatedData = {
        codigo: 'PROD' + id,
        nombre: 'Producto Actualizado ' + id,
        descripcion: 'Descripción actualizada',
        precio_compra: 120,
        precio_venta: 180,
        stock: 15,
        stock_minimo: 3,
        categoria_id: 1
      };
      
      await productService.update(id, updatedData);
      await loadProducts();
      Alert.alert('Éxito', 'Producto actualizado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar');
      console.error(error);
    }
  };

  // ELIMINAR PRODUCTO
  const deleteProduct = async (id, nombre) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de eliminar "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.delete(id);
              await loadProducts();
              Alert.alert('Éxito', 'Producto eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadProducts();
    }
  }, [isLoggedIn]);

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
    setProductos([]);
  };

  // SI ESTÁ LOGUEADO: Mostrar productos REALES
  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📦 Sistema de Inventario</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={createProduct}>
          <Text style={styles.addButtonText}>+ Crear Producto de Prueba</Text>
        </TouchableOpacity>

        {loading ? (
          <Text style={styles.loadingText}>Cargando productos...</Text>
        ) : (
          <ScrollView style={styles.productList}>
            {productos.map((producto) => (
              <View key={producto.id} style={styles.productCard}>
                <Text style={styles.productName}>{producto.nombre}</Text>
                <Text style={styles.productDescription}>{producto.descripcion}</Text>
                <Text style={styles.productPrice}>Precio: ${producto.precio_venta}</Text>
                <Text style={styles.productStock}>Stock: {producto.stock} unidades</Text>
                <Text style={styles.productCategory}>Categoría: {producto.categoria_nombre}</Text>
                <Text style={styles.productCode}>Código: {producto.codigo}</Text>
                
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => updateProduct(producto.id)}
                  >
                    <Text style={styles.buttonText}>✏️ Editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteProduct(producto.id, producto.nombre)}
                  >
                    <Text style={styles.buttonText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }

  // SI NO ESTÁ LOGUEADO: Mostrar login
  return (
    <View style={styles.loginContainer}>
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

// SOLO UN BLOQUE DE ESTILOS - ELIMINA EL DUPLICADO
const styles = StyleSheet.create({
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
    fontSize: 16,
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
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    fontStyle: 'italic',
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
    fontWeight: 'bold',
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
  },
  productCode: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FF9500',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});