import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const randomCode = () => {
  const randomNumbers = Math.floor(Math.random() * 90 + 10);
  const specialChars = ["#", "@", "$", "&", "*", "!"];
  const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
  const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);

  return `${randomNumbers}${randomSpecialChar}${randomLetter}`;
};

export default function CadastroAluno({ navigation }) {
  const [nome, setNome] = useState("");

  const handleCadastro = async () => {
    if (nome.trim() === "") {
      Alert.alert("Erro", "Por favor, digite o nome do aluno.");
      return;
    }

    const codigoGerado = randomCode();

    const novoAluno = {
      id: Date.now().toString(),
      name: nome,
      code: codigoGerado,
      used: false,
      date: null,
      time: null,
    };

    try {
      const storedData = await AsyncStorage.getItem("alunos");
      const alunos = storedData ? JSON.parse(storedData) : [];

      alunos.push(novoAluno);
      await AsyncStorage.setItem("alunos", JSON.stringify(alunos));

      Alert.alert("Sucesso", `Aluno(a) ${nome} cadastrado(a) com o código "${codigoGerado}"`);
      setNome("");
    } catch (error) {
      console.log("Erro ao salvar aluno:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o aluno.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Aluno</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do aluno"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar e gerar código</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
