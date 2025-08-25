import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AdmScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administrador</Text>

      {/* botões */}

      <TouchableOpacity>
        <Text style={styles.buttonText}>Cadastrar alunos</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.buttonText}>Visualizar tickets utilizados</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.buttonText}>Histórico de Tickets</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.buttonText}>Resetar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#007bff",
    marginVertical: 10,
  },
});
