import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Text style={styles.title}>Entrar como</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LoginAluno")}
      >
        <Text style={styles.option}>Aluno</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.adminButton]}
        onPress={() => navigation.navigate("LoginAdmin")}
      >
        <Text style={styles.option}>Administrador</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    marginBottom: 40,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#3D8BFF",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  adminButton: {
    backgroundColor: "#FF8C42",
  },
  option: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
  },
});
