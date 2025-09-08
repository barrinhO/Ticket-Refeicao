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

const TICKET_START_HOUR = 14;
const TICKET_START_MINUTE = 55;
const TICKET_END_HOUR = 15;
const TICKET_END_MINUTE = 5;

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

function isWithinTicketTime(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const start = TICKET_START_HOUR * 60 + TICKET_START_MINUTE;
  const end = TICKET_END_HOUR * 60 + TICKET_END_MINUTE;
  const now = hour * 60 + minute;
  return now >= start && now <= end;
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
    let locationSubscription;

    const startWatchingLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationMessage("Permissão de localização negada.");
        setIsLoadingLocation(false);
        return;
      }

      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 5000, // Atualiza a cada 5 segundos
            distanceInterval: 10, // Atualiza a cada 10 metros
          },
          (location) => {
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
            setIsLoadingLocation(false);
          }
        );
      } catch (error) {
        setIsLocationVerified(false);
        setLocationMessage(
          "Não foi possível obter a localização. Verifique seu GPS."
        );
        setIsLoadingLocation(false);
      }
    };

    startWatchingLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
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
            Status: Ticket Resgatado! ✅
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
        {ticketStatus === "nao_recebido" && (
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
        )}

        {isLocationVerified &&
          ticketStatus === "nao_recebido" &&
          isWithinTicketTime(currentTime) && (
            <TouchableOpacity
              style={styles.ticketButton}
              onPress={handleReceiveTicket}
            >
              <Text style={styles.buttonText}>Resgatar Ticket</Text>
            </TouchableOpacity>
          )}

        {!isWithinTicketTime(currentTime) &&
          ticketStatus === "nao_recebido" && (
            <Text style={styles.infoText}>
              O ticket só pode ser resgatado entre 14:55 e 15:05.
            </Text>
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
  statusTextDisponivel: { fontSize: 18, fontWeight: "bold", color: "#014f03" },
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
