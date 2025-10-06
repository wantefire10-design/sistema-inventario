import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const ProductList = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      
      // 🚨 DEBUG: FORZAR ERROR TEMPORALMENTE
      console.log('🔴 DEBUG: Forzando error para ver logs...');
      throw new Error('TEST ERROR: Esto debería aparecer en la terminal de Expo');
      
      
    } catch (error) {
      // 🚨 DEBUG DETALLADO DEL ERROR
      console.log('=== 🚨 ERROR DETALLADO 🚨 ===');
      console.log('Mensaje:', error.message);
      console.log('Stack:', error.stack);
      console.log('Tipo:', typeof error);
      console.log('=== 🚨 FIN ERROR 🚨 ===');
      
      Alert.alert('Error de Conexión', `No se pudieron cargar los productos: ${error.message}`);
      
      // MOSTRAR DATOS DE PRUEBA SI FALLA LA CONEXIÓN
      console.log('🔄 Mostrando datos de prueba...');
      const productosEjemplo = [
        { id: 1, nombre: 'Laptop HP', precio: 12500, stock: 15, categoria_nombre: 'Electrónicos' },
        { id: 2, nombre: 'Mouse Inalámbrico', precio: 450.50, stock: 25, categoria_nombre: 'Electrónicos' },
        { id: 3, nombre: 'Resma de Papel A4', precio: 280, stock: 8, categoria_nombre: 'Oficina' },
      ];
      setProductos(productosEjemplo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const renderProducto = ({ item }) => (
    <TouchableOpacity 
      style={styles.productoCard}
      onPress={() => Alert.alert('Editar', `Funcionalidad para editar: ${item.nombre}`)}
    >
      <Text style={styles.productoNombre}>{item.nombre}</Text>
      <Text style={styles.productoPrecio}>${item.precio}</Text>
      <Text style={styles.productoStock}>Stock: {item.stock} unidades</Text>
      <Text style={styles.productoCategoria}>{item.categoria_nombre}</Text>
      <Text style={styles.productoSource}>
        {item.id <= 3 ? '🔄 Datos de prueba' : '✅ Datos reales de BD'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando productos desde la base de datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Gestión de Inventario</Text>
      <Text style={styles.subtitle}>
        {productos.length > 0 && productos[0].id <= 3 ? '🔄 Usando datos de prueba' : '✅ Conectado a Base de Datos - Reto #4'}
      </Text>
      
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProducto}
        style={styles.lista}
      />

      <TouchableOpacity 
        style={styles.botonAgregar}
        onPress={() => Alert.alert('Agregar', 'Funcionalidad para agregar productos')}
      >
        <Text style={styles.botonTexto}>+ Agregar Producto</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botonDebug}
        onPress={cargarProductos}
      >
        <Text style={styles.botonTexto}>🐛 Probar Conexión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  lista: {
    flex: 1,
  },
  productoCard: {
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
  productoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productoPrecio: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
  productoStock: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productoCategoria: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontStyle: 'italic',
  },
  productoSource: {
    fontSize: 10,
    color: '#FF9800',
    marginTop: 5,
    fontWeight: 'bold',
  },
  botonAgregar: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  botonDebug: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  botonTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductList;