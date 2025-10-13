import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// URL de tu API. ¡IMPORTANTE! Usa la IP de tu computadora, no 'localhost'.
const API_URL = 'http://10.140.226.149:3000/api';

export default function TabOneScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Estados para manejar la sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Estados para manejar los datos
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el modal y el formulario
  const [modalVisible, setModalVisible] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  // Cerca de tus otros estados
const [confirmModalVisible, setConfirmModalVisible] = useState(false);
const [productToDelete, setProductToDelete] = useState<any>(null);
  
  // --- CORRECCIÓN: Estado del formulario ajustado a la base de datos ---
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio_compra: '',
    precio_venta: '',
    stock: '',
    stock_minimo: '',
    categoria_id: null,
  });

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

  // Efecto para cargar datos cuando el estado de login cambia
  useEffect(() => {
    if (isLoggedIn && authToken) {
      fetchData(authToken);
    }
  }, [isLoggedIn, authToken]);

  const fetchData = async (token: string) => {
    setIsLoading(true);
    try {
      // Obtener productos
      const productosResponse = await fetch(`${API_URL}/productos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!productosResponse.ok) throw new Error('Error al obtener los productos');
      const productosData = await productosResponse.json();
      setProductos(productosData);

      // Obtener categorías para el formulario
      const categoriasResponse = await fetch(`${API_URL}/productos/categorias/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!categoriasResponse.ok) throw new Error('Error al obtener las categorías');
      const categoriasData = await categoriasResponse.json();
      setCategorias(categoriasData);

    } catch (error) {
      console.error(error);
      Alert.alert('❌ Error', 'No se pudieron cargar los datos.');
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
        const userRole = data.user.username === 'admin' ? 'admin' : 'usuario';
        if (data.token && data.user) {
          await AsyncStorage.setItem('userToken', data.token);
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
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setAuthToken(null);
    setUserRole(null);
    setUsername('');
    setPassword('');
    setProductos([]);
  };
  
  // REEMPLAZA tu función handleDelete actual con esta:
const handleDelete = (id: number) => {
  // Guarda el ID del producto que queremos eliminar
  setProductToDelete(id); 
  // Abre nuestro modal de confirmación personalizado
  setConfirmModalVisible(true); 
};

// AGREGA esta nueva función que contiene la lógica de borrado
const executeDelete = async () => {
  if (!productToDelete || !authToken) return;

  try {
    const response = await fetch(`${API_URL}/productos/${productToDelete}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    if (!response.ok) {
      throw new Error('La respuesta del servidor no fue exitosa.');
    }

    // Usamos una alerta simple de éxito, que sí funciona bien en la web.
    Alert.alert('✅ Éxito', 'Producto eliminado correctamente.'); 
    fetchData(authToken);
  } catch (error) {
    console.error('Error en la operación de borrado:', error);
    Alert.alert('❌ Error', 'No se pudo completar la eliminación.');
  } finally {
    // Cierra el modal y limpia el estado
    setConfirmModalVisible(false);
    setProductToDelete(null);
  }
};
  
  const openModalForCreate = () => {
    setSelectedProduct(null);
    // --- CORRECCIÓN: Limpia el formulario con los campos correctos ---
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      precio_compra: '',
      precio_venta: '',
      stock: '',
      stock_minimo: '',
      categoria_id: categorias.length > 0 ? (categorias[0] as any).id : null,
    });
    setModalVisible(true);
  };

  const openModalForEdit = (producto: any) => {
    setSelectedProduct(producto);
    // --- CORRECCIÓN: Llena el formulario con los campos correctos ---
    setFormData({
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_compra: String(producto.precio_compra),
        precio_venta: String(producto.precio_venta),
        stock: String(producto.stock),
        stock_minimo: String(producto.stock_minimo),
        categoria_id: producto.categoria_id,
    });
    setModalVisible(true);
  };

  const handleFormChange = (name: string, value: any) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveProduct = async () => {
    if (!authToken) return;

    const url = selectedProduct 
        ? `${API_URL}/productos/${selectedProduct.id}`
        : `${API_URL}/productos`;

    const method = selectedProduct ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            // --- CORRECCIÓN: El cuerpo de la petición usa los campos correctos ---
            body: JSON.stringify({
                ...formData,
                precio_compra: parseFloat(formData.precio_compra),
                precio_venta: parseFloat(formData.precio_venta),
                stock: parseInt(formData.stock, 10),
                stock_minimo: parseInt(formData.stock_minimo, 10),
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ocurrió un error al guardar.');
        }

        Alert.alert('✅ Éxito', `Producto ${selectedProduct ? 'actualizado' : 'creado'} correctamente.`);
        setModalVisible(false);
        fetchData(authToken);

    } catch (error: any) {
        console.error(error);
        Alert.alert('❌ Error', error.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.title}>🔐 Sistema de Inventario</Text>
        <Text style={styles.subtitle}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}> Francisco Javier Montero Ochoa </Text>
        <TextInput style={styles.input} placeholder="Usuario" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              <View style={{flex: 1}}>
                <Text style={styles.productName}>{producto.nombre}</Text>
                {/* --- CORRECCIÓN: Se muestra el precio de venta --- */}
                <Text style={styles.productPrice}>${producto.precio_venta}</Text>
                <Text style={styles.productStock}>Stock: {producto.stock} unidades</Text>
                <Text style={styles.productCategory}>{producto.categoria_nombre ?? 'Sin categoría'}</Text>
              </View>

              {userRole === 'admin' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.editButton} onPress={() => openModalForEdit(producto)}>
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

      {userRole === 'admin' && (
        <TouchableOpacity style={styles.addButton} onPress={openModalForCreate}>
          <Text style={styles.addButtonText}>+ Agregar Producto</Text>
        </TouchableOpacity>
      )}

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</Text>
                  
                  <ScrollView style={{width: '100%'}}>
                      {/* --- CORRECCIÓN: Campos del formulario ajustados --- */}
                      <TextInput placeholder="Código del Producto (ej. PROD001)" value={formData.codigo} onChangeText={(v) => handleFormChange('codigo', v)} style={styles.input} />
                      <TextInput placeholder="Nombre del producto" value={formData.nombre} onChangeText={(v) => handleFormChange('nombre', v)} style={styles.input} />
                      <TextInput placeholder="Descripción" value={formData.descripcion} onChangeText={(v) => handleFormChange('descripcion', v)} style={styles.input} multiline />
                      <TextInput placeholder="Precio de Compra" value={formData.precio_compra} onChangeText={(v) => handleFormChange('precio_compra', v)} style={styles.input} keyboardType="numeric" />
                      <TextInput placeholder="Precio de Venta" value={formData.precio_venta} onChangeText={(v) => handleFormChange('precio_venta', v)} style={styles.input} keyboardType="numeric" />
                      <TextInput placeholder="Stock Actual" value={formData.stock} onChangeText={(v) => handleFormChange('stock', v)} style={styles.input} keyboardType="numeric" />
                      <TextInput placeholder="Stock Mínimo" value={formData.stock_minimo} onChangeText={(v) => handleFormChange('stock_minimo', v)} style={styles.input} keyboardType="numeric" />

                      <Text style={styles.label}>Categoría</Text>
                      <View style={styles.pickerContainer}>
                        <Picker selectedValue={formData.categoria_id} onValueChange={(itemValue) => handleFormChange('categoria_id', itemValue)}>
                          {categorias.map((cat: any) => (
                              <Picker.Item key={cat.id} label={cat.nombre} value={cat.id} />
                          ))}
                        </Picker>
                      </View>
                  </ScrollView>

                  <View style={styles.modalButtons}>
                      <Pressable style={[styles.button, styles.buttonCancel]} onPress={() => setModalVisible(false)}>
                          <Text style={styles.buttonText}>Cancelar</Text>
                      </Pressable>
                      <Pressable style={[styles.button, styles.buttonSave]} onPress={handleSaveProduct}>
                          <Text style={styles.buttonText}>Guardar</Text>
                      </Pressable>
                  </View>
              </View>
          </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonDeleteConfirm]}
                onPress={executeDelete}
              >
                <Text style={styles.buttonText}>Sí, Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Los estilos son los mismos, no necesitan cambios
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
      },
      button: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
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
      productList: {
        flex: 1,
      },
      productCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
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
      // En tu StyleSheet.create
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonDeleteConfirm: {
    backgroundColor: '#F44336', // Rojo para eliminar
    flex: 1,
    marginLeft: 10,
    width: 'auto',
    padding: 15,
  },
      actionButtonText: {
        color: 'white',
        fontSize: 16,
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
      // Estilos del Modal
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        width: '90%',
        maxHeight: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
      },
      label: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginTop: 10,
        fontSize: 16,
        color: '#555',
      },
      pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        width: '100%',
        marginBottom: 15,
        justifyContent: 'center',
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
      },
      buttonCancel: {
        backgroundColor: '#6c757d',
        flex: 1,
        marginRight: 10,
        width: 'auto',
        padding: 15,
      },
      buttonSave: {
        backgroundColor: '#007AFF',
        flex: 1,
        marginLeft: 10,
        width: 'auto',
        padding: 15,
      },
});