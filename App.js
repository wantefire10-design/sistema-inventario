import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddProduct from './src/screens/AddProduct';
import EditProduct from './src/screens/EditProduct';
import ProductList from './src/screens/ProductList';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductList">
        <Stack.Screen name="ProductList" component={ProductList} options={{ title: 'Lista de Productos' }} />
        <Stack.Screen name="AddProduct" component={AddProduct} options={{ title: 'Agregar Producto' }} />
        <Stack.Screen name="EditProduct" component={EditProduct} options={{ title: 'Editar Producto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}