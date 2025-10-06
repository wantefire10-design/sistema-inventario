import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddProduct from './screens/AddProduct'; // ⬅️ QUITA /src
import EditProduct from './screens/EditProduct'; // ⬅️ QUITA /src  
import LoginScreen from './screens/LoginScreen'; // ⬅️ AGREGA Login
import ProductList from './screens/ProductList'; // ⬅️ QUITA /src

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">  {/* ⬅️ CAMBIA a Login */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductList" component={ProductList} options={{ title: 'Lista de Productos' }} />
        <Stack.Screen name="AddProduct" component={AddProduct} options={{ title: 'Agregar Producto' }} />
        <Stack.Screen name="EditProduct" component={EditProduct} options={{ title: 'Editar Producto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}