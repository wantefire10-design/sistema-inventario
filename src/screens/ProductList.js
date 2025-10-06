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
    // 🚨 DEBUG EXTREMO - Verificar que la función se ejecuta
    console.log('🚨 DEBUG: cargarProductos INICIADA - ' + new Date().toLocaleTimeString());
    console.log('🚨 DEBUG: productosAPI:', typeof productosAPI);
    
    try {
      setLoading(true);
      console.log('🚨 DEBUG: Dentro del try');
      
      // 🚨 PRIMERO probar si la función existe
      if (typeof productosAPI?.getAll !== 'function') {
        throw new Error('productosAPI.getAll no es una función');
      }
      
      console.log('🚨 DEBUG: Llamando a productosAPI.getAll()...');
      
      // 🚨 CONEXIÓN REAL AL BACKEND
      const response = await productosAPI.getAll();
      console.log('🚨 DEBUG: Response recibida:', response?.status);
      
      if (response.data && response.data.length > 0) {
        console.log(`✅ Cargados ${response.data.length} productos reales de la BD`);
        setProductos(response.data);
      } else {
        throw new Error('No se recibieron productos de la base de datos');
      }
      
    } catch (error) {
      console.log('🚨 ERROR COMPLETO:', error.message);
      
      // 🚨 SOLO EN CASO DE EMERGENCIA - Datos de prueba
      Alert.alert(
        'Modo de Prueba', 
        'Usando datos de prueba. Backend no disponible.\n\n' +
        'ERROR: ' + error.message,
        [{ text: 'Entendido' }]
      );
      
      const productosEjemplo = [
        { 
          id: 1, 
          nombre: 'Laptop HP', 
          precio_venta: 12500, 
          stock: 15, 
          categoria_nombre: 'Electrónicos',
          descripcion: 'Laptop de alta gama',
          codigo: 'PROD001'
        },
        { 
          id: 2, 
          nombre: 'Mouse Inalámbrico', 
          precio_venta: 450.50, 
          stock: 25, 
          categoria_nombre: 'Electrónicos',
          descripcion: 'Mouse óptico inalámbrico',
          codigo: 'PROD002'
        },
      ];
      setProductos(productosEjemplo);
    } finally {
      setLoading(false);
      console.log('🚨 DEBUG: Finalizando cargarProductos');
    }
  };

  useEffect(() => {
    console.log('🚨 DEBUG: useEffect ejecutado');
    cargarProductos();
  }, []);

  const renderProducto = ({ item }) => (
    <TouchableOpacity 
      style={styles.productoCard}
      onPress={() => Alert.alert('Editar', `Funcionalidad para editar: ${item.nombre}`)}
    >
      <Text style={styles.productoNombre}>{item.nombre}</Text>
      <Text style={styles.productoDescripcion}>{item.descripcion}</Text>
      
      <View style={styles.datosFila}>
        <Text style={styles.datoLabel}>Precio: </Text>
        <Text style={styles.productoPrecio}>${item.precio_venta}</Text>
      </View>
      
      <View style={styles.datosFila}>
        <Text style={styles.datoLabel}>Stock: </Text>
        <Text style={styles.productoStock}>{item.stock} unidades</Text>
      </View>
      
      <View style={styles.datosFila}>
        <Text style={styles.datoLabel}>Categoría: </Text>
        <Text style={styles.productoCategoria}>{item.categoria_nombre}</Text>
      </View>

      <View style={styles.datosFila}>
        <Text style={styles.datoLabel}>Stock Mínimo: </Text>
        <Text style={styles.productoStockMinimo}>{item.stock_minimo} unidades</Text>
      </View>
      
      <Text style={styles.productoReal}>
        {item.id <= 2 ? '🔄 Datos de PRUEBA' : '✅ Datos REALES de BD'}
      </Text>
      <Text style={styles.productoCodigo}>Código: {item.codigo}</Text>
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
      {/* 🚨 TÍTULO MUY VISIBLE PARA VERIFICAR CAMBIOS */}
      <Text style={styles.title}>🚨🚨🚨 NUEVA VERSIÓN DEBUG 🚨🚨🚨</Text>
      <Text style={styles.subtitle}>
        {productos.length > 0 && productos[0].id <= 2 ? 
          '🔄 Modo Prueba - Backend no disponible' : 
          '✅ Conectado a Base de Datos - Reto #4'
        }
      </Text>

      <View style={styles.resumenContainer}>
        <Text style={styles.resumenText}>
          {productos.length} productos cargados - {new Date().toLocaleTimeString()}
        </Text>
      </View>
      
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
        <Text style={styles.botonTexto}>🔄 Recargar y Debug</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#FF0000',
    backgroundColor: '#FFEB3B',
    padding: 10,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#007AFF',
    fontWeight: '600',
  },
  resumenContainer: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  resumenText: {
    fontSize: 14,
    color: '#2e7d32',
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
    color: '#333',
  },
  productoDescripcion: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    fontStyle: 'italic',
  },
  datosFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  datoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    width: 100,
  },
  productoPrecio: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  productoStock: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  productoCategoria: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  productoStockMinimo: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600',
  },
  productoReal: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 8,
    fontWeight: 'bold',
  },
  productoCodigo: {
    fontSize: 10,
    color: '#999',
    marginTop: 3,
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