import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Importe suas telas
import LoginScreen from "./screens/LoginScreen";
import LoginAlunoScreen from "./screens/LoginAlunoScreen";
import LoginAdminScreen from "./screens/LoginAdmScreen";
import TelaRecebimentoTicket from "./screens/TelaRecebimentoTicket";
import CadastroAluno from "./screens/CadastroAlunoScreen";
import TicketsUsados from "./screens/ViewTicket";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DummyScreen() {
  return null;
}

function AdmTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Cadastrar") iconName = "person-add";
          if (route.name === "Tickets") iconName = "ticket";
          if (route.name === "Voltar") iconName = "exit-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3D8BFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Cadastrar" component={CadastroAluno} />
      <Tab.Screen name="Tickets" component={TicketsUsados} />
      <Tab.Screen
        name="Voltar"
        component={DummyScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        })}
      />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="LoginAluno"
        component={LoginAlunoScreen}
        options={{ headerShown: true, headerTitle: "Selecionar Aluno" }}
      />
      <Stack.Screen
        name="LoginAdmin"
        component={LoginAdminScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="ReceberTicket"
        component={TelaRecebimentoTicket}
        options={{ headerShown: true, headerTitle: "Resgatar Ticket" }}
      />
      <Stack.Screen name="Home" component={AdmTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// ==== Envolvendo tudo com Redux Provider ====
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
