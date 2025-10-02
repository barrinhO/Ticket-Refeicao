import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { loginAluno } from "../src/store/userSlice";

export default function LoginAlunoScreen({ navigation }) {
  const [codigo, setCodigo] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (codigo.trim() === "") {
      Alert.alert("Erro", "Por favor, preencha o código.");
      return;
    }

    try {
      const storedAlunos = await AsyncStorage.getItem("alunos");
      const alunos = storedAlunos ? JSON.parse(storedAlunos) : [];

      const aluno = alunos.find((al) => al.code === codigo); // <<< CORRETO: "code"

      if (aluno) {
        dispatch(loginAluno(aluno));
        navigation.navigate("ReceberTicket", { aluno });
      } else {
        Alert.alert("Erro", "Código inválido.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao tentar logar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login do Aluno</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu código"
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#333" },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#3D8BFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
