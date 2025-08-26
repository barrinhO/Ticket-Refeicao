import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";

const CANTINA_COORDS = {
  latitude: -27.618306,
  longitude: -48.662846,
};
const MAX_DISTANCE_METERS = 50;

function haversineDistance(coords1, coords2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371e3;

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const TelaRecebimentoTicket = () => {
  const [ticketStatus, setTicketStatus] = useState("nao_recebido");
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [locationMessage, setLocationMessage] = useState(
    "Verificando sua localização..."
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const verifyLocation = async () => {
      setIsLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationMessage("Permissão de localização negada.");
        setIsLoadingLocation(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        const distance = haversineDistance(userCoords, CANTINA_COORDS);

        if (distance <= MAX_DISTANCE_METERS) {
          setIsLocationVerified(true);
          setLocationMessage("Você está na cantina!");
        } else {
          setIsLocationVerified(false);
          setLocationMessage(
            `Você não está na cantina. Aproxime-se para resgatar.`
          );
        }
      } catch (error) {
        setIsLocationVerified(false);
        setLocationMessage(
          "Não foi possível obter a localização. Verifique seu GPS."
        );
      } finally {
        setIsLoadingLocation(false);
      }
    };

    verifyLocation();
  }, []);

  const handleReceiveTicket = () => {
    if (ticketStatus === "nao_recebido") {
      setTicketStatus("disponivel");
      Alert.alert("Sucesso!", "Seu ticket de refeição está disponível.");
    }
  };

  const renderTicketStatus = () => {
    switch (ticketStatus) {
      case "disponivel":
        return (
          <Text style={styles.statusTextDisponivel}>
            Status: Ticket Disponível ✅
          </Text>
        );
      case "usado":
        return (
          <Text style={styles.statusTextUsado}>Status: Ticket Utilizado</Text>
        );
      default:
        return (
          <Text style={styles.statusTextPendente}>
            Status: Nenhum ticket recebido hoje
          </Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.clockText}>
          {currentTime.toLocaleTimeString("pt-BR")}
        </Text>
        <Text style={styles.alunoInfoText}>João Vitor | 43#Q</Text>
      </View>

      <View style={styles.statusBox}>{renderTicketStatus()}</View>

      <View style={styles.actionSection}>
        <View style={styles.locationIndicator}>
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color="#555" />
          ) : (
            <Text
              style={[
                styles.locationText,
                isLocationVerified
                  ? styles.locationTextSuccess
                  : styles.locationTextError,
              ]}
            >
              {isLocationVerified ? "📍 " : "🚫 "}
              {locationMessage}
            </Text>
          )}
        </View>

        {isLocationVerified && ticketStatus === "nao_recebido" && (
          <TouchableOpacity
            style={styles.ticketButton}
            onPress={handleReceiveTicket}
          >
            <Text style={styles.buttonText}>Resgatar Ticket</Text>
          </TouchableOpacity>
        )}

        {ticketStatus !== "nao_recebido" && (
          <Text style={styles.infoText}>
            Você já pegou seu ticket hoje. Volte amanhã!
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
  },
  clockText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  alunoInfoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    textAlign: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  statusBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTextPendente: { fontSize: 18, fontWeight: "bold", color: "#E74C3C" },
  statusTextDisponivel: { fontSize: 18, fontWeight: "bold", color: "#2ECC71" },
  statusTextUsado: { fontSize: 18, fontWeight: "bold", color: "#95A5A6" },
  actionSection: {
    width: "90%",
    alignItems: "center",
    paddingTop: 20,
  },
  locationIndicator: {
    backgroundColor: "#e9ecef",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 30,
    minHeight: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
  },
  locationTextSuccess: {
    color: "#155724",
  },
  locationTextError: {
    color: "#721c24",
  },
  ticketButton: {
    backgroundColor: "#27AE60",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default TelaRecebimentoTicket;
