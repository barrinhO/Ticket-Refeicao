import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginAluno({ navigation }) {
  const [codigo, setCodigo] = useState("");

  const handleLogin = async () => {
    if (codigo.trim() === "") {
      Alert.alert("Erro", "Por favor, preencha o código.");
      return;
    }

    try {
      // Pega todos os alunos salvos
      const storedData = await AsyncStorage.getItem("alunos");
      const alunos = storedData ? JSON.parse(storedData) : [];

      // Procura um aluno com o código digitado
      const alunoEncontrado = alunos.find((aluno) => aluno.code === codigo);

      if (alunoEncontrado) {
        Alert.alert("Sucesso", `Bem-vindo(a), ${alunoEncontrado.name}!`);
        navigation.navigate("ReceberTicket", { aluno: alunoEncontrado });
      } else {
        Alert.alert("Erro", "Código inválido.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao acessar os dados.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login do Aluno</Text>

      <TextInput
        style={styles.input}
        placeholder="Código"
        placeholderTextColor="#999"
        value={codigo}
        onChangeText={setCodigo}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#3D8BFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
