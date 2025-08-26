import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Você é</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.option}>Aluno</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.option}>Admin</Text>
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
    marginBottom: 20,
  },

  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#5c64c9",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },

  option: {
    fontSize: 20,
    color: "#fff",
    marginVertical: 10,
  },
});
