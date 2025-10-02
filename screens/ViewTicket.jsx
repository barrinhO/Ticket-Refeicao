import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  AppState,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

export default function UsedTicketsScreen() {
  const [allTickets, setAllTickets] = useState([]);
  const [filter, setFilter] = useState("used");
  const [isLoading, setIsLoading] = useState(true);
  const appState = useRef(AppState.currentState);

  // Carrega tickets do AsyncStorage e reseta se for novo dia
  const loadAndResetTickets = async () => {
    setIsLoading(true);
    try {
      const lastResetDate = await AsyncStorage.getItem("lastResetDate");
      const today = new Date().toLocaleDateString("pt-BR");

      const storedData = await AsyncStorage.getItem("alunos");
      const currentTickets = storedData ? JSON.parse(storedData) : [];

      if (lastResetDate !== today) {
        const resetedTickets = currentTickets.map((aluno) => ({
          ...aluno,
          used: false,
          date: null,
          time: null,
        }));
        await AsyncStorage.setItem("alunos", JSON.stringify(resetedTickets));
        await AsyncStorage.setItem("lastResetDate", today);
        setAllTickets(resetedTickets);
      } else {
        setAllTickets(currentTickets);
      }
    } catch (error) {
      console.log("Erro no reset ou carregamento de tickets:", error);
      setAllTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAndResetTickets();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        loadAndResetTickets();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // Copiar código para clipboard
  const copyToClipboard = async (text) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert("Copiado!", "O código foi copiado para a área de transferência.");
  };

  // Excluir ticket
  const deleteTicket = async (id) => {
    try {
      const updatedTickets = allTickets.filter((aluno) => aluno.id !== id);
      await AsyncStorage.setItem("alunos", JSON.stringify(updatedTickets));
      setAllTickets(updatedTickets);
    } catch (error) {
      console.log("Erro ao excluir aluno:", error);
    }
  };

  const confirmarExclusao = (id) => {
    Alert.alert("Excluir Ticket", "Deseja realmente excluir este ticket?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => deleteTicket(id) },
    ]);
  };

  const filteredTickets = allTickets.filter((ticket) =>
    filter === "used" ? ticket.used : !ticket.used,
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.nameAndCopyContainer}>
        <TouchableOpacity
          onPress={() => copyToClipboard(item.code)}
          style={styles.nameTextWrapper}
        >
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {item.name} {item.code ? `| ${item.code}` : ""}
          </Text>
        </TouchableOpacity>
        {item.code && (
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => copyToClipboard(item.code)}
          >
            <Ionicons name="copy-outline" size={22} color="#4caf50" />
          </TouchableOpacity>
        )}
      </View>
      {item.used ? (
        <Text style={styles.ticketInfoUsed}>Ticket resgatado</Text>
      ) : (
        <Text style={styles.ticketInfoUnused}>Ticket não resgatado</Text>
      )}
      {item.used && (
        <Text style={styles.dateInfo}>
          <Text style={styles.label}>Resgatado em:</Text> {item.date} {item.time}
        </Text>
      )}
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmarExclusao(item.id)}>
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>
          Carregando e atualizando tickets...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Gerenciamento de Tickets</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "used" && styles.activeButton]}
          onPress={() => setFilter("used")}
        >
          <Text style={styles.buttonText}>Usados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "unused" && styles.activeButton]}
          onPress={() => setFilter("unused")}
        >
          <Text style={styles.buttonText}>Não Usados</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredTickets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum ticket encontrado.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f5" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nameAndCopyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  nameTextWrapper: { flex: 1, marginRight: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  copyButton: { paddingLeft: 0 },
  ticketInfoUsed: { color: "#4caf50", fontSize: 16, fontWeight: "bold", marginTop: 5 },
  ticketInfoUnused: { color: "#f44336", fontSize: 16, fontWeight: "bold", marginTop: 5 },
  dateInfo: { fontSize: 14, color: "#666", marginTop: 5 },
  label: { fontWeight: "bold", color: "#333" },
  filterContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
  },
  activeButton: { backgroundColor: "#4caf50" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#f44336",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
});
