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
import { productosAPI } from '../services/api';

const ProductList = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      
      // RETO #4: CONECTAR CON API REAL
      console.log('🔗 Conectando con backend para cargar productos...');
      const response = await productosAPI.getAll();
      console.log('📦 Productos cargados desde la base de datos:', response.data);
      setProductos(response.data);
      
      //  DATOS DE PRUEBA (COMENTADOS)
      // const productosEjemplo = [
      //   { id: 1, nombre: 'Laptop HP', precio: 12500, stock: 15, categoria_nombre: 'Electrónicos' },
      //   { id: 2, nombre: 'Mouse Inalámbrico', precio: 450.50, stock: 25, categoria_nombre: 'Electrónicos' },
      //   { id: 3, nombre: 'Resma de Papel A4', precio: 280, stock: 8, categoria_nombre: 'Oficina' },
      // ];
      // setProductos(productosEjemplo);
      
    } catch (error) {
      console.error(' Error cargando productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos de la base de datos');
      
      // MOSTRAR DATOS DE PRUEBA SI FALLA LA CONEXIÓN
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
      <Text style={styles.productoReal}>✅ Datos reales de BD</Text>
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
      <Text style={styles.subtitle}>✅ Conectado a Base de Datos - Reto #4</Text>
      
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
  productoReal: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 5,
    fontWeight: 'bold',
  },
  botonAgregar: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  botonTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductList;