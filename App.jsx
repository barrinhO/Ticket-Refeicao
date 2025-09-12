import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./screens/LoginScreen";
import LoginAlunoScreen from "./screens/LoginAlunoScreen";
import LoginAdminScreen from "./screens/LoginAdmScreen";
import TelaRecebimentoTicket from "./screens/TelaRecebimentoTicket";
import CadastroAluno from "./screens/CadastroAlunoScreen";
import TicketsUsados from "./screens/ViewTicket";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AdmTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Cadastrar") iconName = "person-add";
          if (route.name === "Tickets") iconName = "ticket";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3D8BFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Cadastrar" component={CadastroAluno} />
      <Tab.Screen name="Tickets" component={TicketsUsados} />
    </Tab.Navigator>
  );
}

// Stack principal
function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
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
        name="ReceberTicket"
        component={TelaRecebimentoTicket}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="Home"
        component={AdmTabNavigator} // <- aqui a administração vira Tab Navigator
        options={{ headerShown: false }}
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
