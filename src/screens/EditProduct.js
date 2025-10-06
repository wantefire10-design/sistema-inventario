import { useState } from 'react';
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
// import { productosAPI } from '../services/api'; // Descomentar cuando tengamos el token

const EditProduct = ({ navigation, route }) => {
  const { producto } = route.params;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: producto.nombre || '',
    descripcion: producto.descripcion || '',
    precio: producto.precio?.toString() || '',
    stock: producto.stock?.toString() || '',
    stock_minimo: producto.stock_minimo?.toString() || '5',
    categoria_id: producto.categoria_id?.toString() || '1',
    codigo_barras: producto.codigo_barras || ''
  });

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.precio || !form.stock) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      // Simular actualización exitosa
      setTimeout(() => {
        Alert.alert(
          'Éxito',
          'Producto actualizado correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }, 1000);

      // Cuando tengamos el token, descomentar esto:
      // await productosAPI.update(producto.id, {
      //   nombre: form.nombre,
      //   descripcion: form.descripcion,
      //   precio: parseFloat(form.precio),
      //   stock: parseInt(form.stock),
      //   stock_minimo: parseInt(form.stock_minimo),
      //   categoria_id: parseInt(form.categoria_id),
      //   codigo_barras: form.codigo_barras
      // });
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el producto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Simular eliminación exitosa
              setTimeout(() => {
                Alert.alert('Éxito', 'Producto eliminado correctamente');
                navigation.goBack();
              }, 1000);

              // Cuando tengamos el token, descomentar esto:
              // await productosAPI.delete(producto.id);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✏️ Editar Producto</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre del Producto *</Text>
        <TextInput
          style={styles.input}
          value={form.nombre}
          onChangeText={(text) => handleChange('nombre', text)}
          placeholder="Ej: Laptop HP 15"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.descripcion}
          onChangeText={(text) => handleChange('descripcion', text)}
          placeholder="Descripción del producto"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Precio *</Text>
        <TextInput
          style={styles.input}
          value={form.precio}
          onChangeText={(text) => handleChange('precio', text)}
          placeholder="0.00"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Stock *</Text>
        <TextInput
          style={styles.input}
          value={form.stock}
          onChangeText={(text) => handleChange('stock', text)}
          placeholder="0"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Stock Mínimo</Text>
        <TextInput
          style={styles.input}
          value={form.stock_minimo}
          onChangeText={(text) => handleChange('stock_minimo', text)}
          placeholder="5"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Código de Barras</Text>
        <TextInput
          style={styles.input}
          value={form.codigo_barras}
          onChangeText={(text) => handleChange('codigo_barras', text)}
          placeholder="Opcional"
        />

        <TouchableOpacity 
          style={[styles.boton, loading && styles.botonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.botonTexto}>Actualizar Producto</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botonEliminar}
          onPress={handleDelete}
        >
          <Text style={styles.botonTextoEliminar}>🗑️ Eliminar Producto</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botonCancelar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.botonTextoCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  boton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botonDisabled: {
    backgroundColor: '#ccc',
  },
  botonTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonEliminar: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTextoEliminar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonCancelar: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  botonTextoCancelar: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProduct;