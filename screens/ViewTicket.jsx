import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

const UsedTicketsScreen = () => {
  const [allTickets, setAllTickets] = useState([
    {
      id: "1",
      name: "João Vitor",
      used: true,
      date: "25/09/2025",
      time: "15:00",
    },
    {
      id: "2",
      name: "Maria Silva",
      used: true,
      date: "25/09/2025",
      time: "15:02",
    },
    { id: "16", name: "Ricardo Dias", used: false, date: null, time: null },
  ]);

  const [filter, setFilter] = useState("used");

  const filteredTickets = allTickets.filter((ticket) => {
    if (filter === "used") {
      return ticket.used;
    } else {
      return !ticket.used;
    }
  });

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.name}>{item.name}</Text>
      {item.used ? (
        <Text style={styles.ticketInfoUsed}>Ticket resgatado</Text>
      ) : (
        <Text style={styles.ticketInfoUnused}>Ticket não resgatado</Text>
      )}
      {item.used && (
        <Text style={styles.dateInfo}>
          <Text style={styles.label}>Resgatado em:</Text> {item.date}{" "}
          {item.time}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Gerenciamento de Tickets</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "used" && styles.activeButton,
          ]}
          onPress={() => setFilter("used")}
        >
          <Text style={styles.buttonText}>Usados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "unused" && styles.activeButton,
          ]}
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
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
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  ticketInfoUsed: {
    color: "#4caf50",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  ticketInfoUnused: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  dateInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UsedTicketsScreen;
