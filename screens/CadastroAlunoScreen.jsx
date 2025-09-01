import {
  View,
  Text,
  TouchableOpSacity,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

const randomCode = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function CadastroAluno() {
  const [nome, setNome] = useState("");

  const handleCadastro = () => {
    if (nome.trim() === "") {
      Alert.alert("Erro", "Por favor, digite o nome do aluno.");
      return;
    }
    Alert.alert(
      "Sucesso",
      `Aluno(a) ${nome} cadastrado(a)!\n\nCódigo: ${randomCode(100000, 999999)}`
    );

    setNome("");
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
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
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
