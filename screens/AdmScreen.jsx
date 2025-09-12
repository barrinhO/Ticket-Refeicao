// AdmScreen.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CadastroAluno from "./CadastroAlunoScreen";
import TicketsUsados from "./ViewTicket";

const Tab = createBottomTabNavigator();

export default function AdmScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Cadastrar"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Cadastrar") iconName = "person-add";
          if (route.name === "Tickets") iconName = "ticket";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3D8BFF",
        tabBarInactiveTintColor: "gray",
      })}
    ></Tab.Navigator>
  );
}
