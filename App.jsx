import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import AdmScreen from "./screens/AdmScreen";
import ReceiveTicket from "./screens/ReceiveTicket";
import LoginScreen from "./screens/LoginScreen";
import LoginAlunoScreen from "./screens/LoginAlunoScreen";
import LoginAdminScreen from "./screens/LoginAdmScreen";
import CadastroAluno from "./screens/CadastroAlunoScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Administrador">
      <Drawer.Screen
        name="Administrador"
        component={AdmScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Receber Ticket"
        component={ReceiveTicket}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="LoginAluno"
        component={LoginAlunoScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />

      <Stack.Screen
        name="LoginAdmin"
        component={LoginAdminScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />

      <Stack.Screen
        name="CadastrarAluno"
        component={CadastroAluno}
        options={{ headerShown: true, headerTitle: "" }}
      />

      <Stack.Screen
        name="Home"
        component={DrawerNavigator}
        options={{
          headerShown: false,
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
