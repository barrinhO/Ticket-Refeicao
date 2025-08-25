import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TelaLocalizacao = ({ navigation }) => {
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(false);
  const [permissaoLocalizacao, setPermissaoLocalizacao] = useState(null);
  const [dentroRegiao, setDentroRegiao] = useState(false);
  const [distanciaEscola, setDistanciaEscola] = useState(null);
  const [ultimaVerificacao, setUltimaVerificacao] = useState(null);

  // Coordenadas da escola (exemplo - substitua pelas coordenadas reais)
  const COORDENADAS_ESCOLA = {
    latitude: -23.5505, // Exemplo: São Paulo
    longitude: -46.6333,
    raioPermitido: 100, // 100 metros de raio
  };

  useEffect(() => {
    verificarPermissaoLocalizacao();
  }, []);

  const verificarPermissaoLocalizacao = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissaoLocalizacao(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Para receber tickets, você precisa permitir o acesso à localização.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Tentar Novamente', onPress: verificarPermissaoLocalizacao },
          ]
        );
        return;
      }

      // Se a permissão foi concedida, obter localização automaticamente
      obterLocalizacaoAtual();
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      Alert.alert('Erro', 'Não foi possível verificar as permissões de localização.');
    }
  };

  const obterLocalizacaoAtual = async () => {
    if (!permissaoLocalizacao) {
      Alert.alert('Erro', 'Permissão de localização não concedida.');
      return;
    }

    setCarregandoLocalizacao(true);
    
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });

      setLocalizacaoAtual(location);
      setUltimaVerificacao(new Date());
      
      const distancia = calcularDistancia(
        location.coords.latitude,
        location.coords.longitude,
        COORDENADAS_ESCOLA.latitude,
        COORDENADAS_ESCOLA.longitude
      );

      setDistanciaEscola(distancia);
      setDentroRegiao(distancia <= COORDENADAS_ESCOLA.raioPermitido);

      // Salvar localização no AsyncStorage para histórico
      await salvarHistoricoLocalizacao(location, distancia);

    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert(
        'Erro de Localização',
        'Não foi possível obter sua localização. Verifique se o GPS está ativado.',
        [
          { text: 'OK' },
          { text: 'Tentar Novamente', onPress: obterLocalizacaoAtual },
        ]
      );
    } finally {
      setCarregandoLocalizacao(false);
    }
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distância em metros
  };

  const salvarHistoricoLocalizacao = async (location, distancia) => {
    try {
      const historicoAtual = await AsyncStorage.getItem('historicoLocalizacao');
      const historico = historicoAtual ? JSON.parse(historicoAtual) : [];
      
      const novoRegistro = {
        timestamp: new Date().toISOString(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        distanciaEscola: distancia,
        dentroRegiao: distancia <= COORDENADAS_ESCOLA.raioPermitido,
      };

      historico.push(novoRegistro);
      
      // Manter apenas os últimos 50 registros
      if (historico.length > 50) {
        historico.splice(0, historico.length - 50);
      }

      await AsyncStorage.setItem('historicoLocalizacao', JSON.stringify(historico));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  };

  const simularLocalizacaoEscola = () => {
    Alert.alert(
      'Simular Localização',
      'Deseja simular que está na escola para testes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Simular',
          onPress: () => {
            const localizacaoSimulada = {
              coords: {
                latitude: COORDENADAS_ESCOLA.latitude,
                longitude: COORDENADAS_ESCOLA.longitude,
                accuracy: 5,
              },
              timestamp: Date.now(),
            };
            
            setLocalizacaoAtual(localizacaoSimulada);
            setDistanciaEscola(0);
            setDentroRegiao(true);
            setUltimaVerificacao(new Date());
            
            Alert.alert('Sucesso', 'Localização simulada! Você está na escola.');
          }
        },
      ]
    );
  };

  const irParaReceberTicket = () => {
    if (!dentroRegiao) {
      Alert.alert(
        'Localização Inválida',
        `Você precisa estar dentro da escola para receber tickets. Distância atual: ${Math.round(distanciaEscola)}m`
      );
      return;
    }

    navigation.navigate('ReceberTicket', {
      localizacaoVerificada: true,
      coordenadas: localizacaoAtual?.coords,
    });
  };

  const formatarCoordenadas = (coords) => {
    if (!coords) return 'N/A';
    return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
  };

  const formatarHorario = (data) => {
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      <LinearGradient
        colors={['#4A90E2', '#357ABD', '#2E6BA8']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Verificação de Localização</Text>
        <Text style={styles.headerSubtitle}>
          Confirme sua presença na escola
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Status da Localização */}
        <View style={[
          styles.statusCard,
          { backgroundColor: dentroRegiao ? '#4CAF50' : '#F44336' }
        ]}>
          <Ionicons 
            name={dentroRegiao ? "location" : "location-outline"} 
            size={48} 
            color="white" 
          />
          <Text style={styles.statusTitle}>
            {dentroRegiao ? 'DENTRO DA REGIÃO' : 'FORA DA REGIÃO'}
          </Text>
          <Text style={styles.statusSubtitle}>
            {dentroRegiao 
              ? 'Você pode receber tickets'
              : 'Aproxime-se da escola'
            }
          </Text>
        </View>

        {/* Informações da Localização */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informações de Localização</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="navigate" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Coordenadas Atuais:</Text>
              <Text style={styles.infoValue}>
                {formatarCoordenadas(localizacaoAtual?.coords)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="business" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Coordenadas da Escola:</Text>
              <Text style={styles.infoValue}>
                {formatarCoordenadas(COORDENADAS_ESCOLA)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="resize" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Distância da Escola:</Text>
              <Text style={[
                styles.infoValue,
                { color: dentroRegiao ? '#4CAF50' : '#F44336' }
              ]}>
                {distanciaEscola !== null 
                  ? `${Math.round(distanciaEscola)}m` 
                  : 'Calculando...'
                }
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="radio-button-on" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Raio Permitido:</Text>
              <Text style={styles.infoValue}>
                {COORDENADAS_ESCOLA.raioPermitido}m
              </Text>
            </View>
          </View>

          {ultimaVerificacao && (
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Última Verificação:</Text>
                <Text style={styles.infoValue}>
                  {formatarHorario(ultimaVerificacao)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Botões de Ação */}
        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={obterLocalizacaoAtual}
            disabled={carregandoLocalizacao}
          >
            {carregandoLocalizacao ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="refresh" size={24} color="white" />
            )}
            <Text style={styles.botaoTextoSecundario}>
              {carregandoLocalizacao ? 'Verificando...' : 'Atualizar Localização'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoSimular}
            onPress={simularLocalizacaoEscola}
          >
            <Ionicons name="flask" size={24} color="white" />
            <Text style={styles.botaoTextoSecundario}>
              Simular Localização
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoPrincipal,
              { 
                backgroundColor: dentroRegiao ? '#4CAF50' : '#CCCCCC',
                opacity: dentroRegiao ? 1 : 0.6 
              }
            ]}
            onPress={irParaReceberTicket}
            disabled={!dentroRegiao}
          >
            <Ionicons name="restaurant" size={24} color="white" />
            <Text style={styles.botaoTextoPrincipal}>
              {dentroRegiao ? 'Continuar para Ticket' : 'Localização Inválida'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Aviso de Permissão */}
        {permissaoLocalizacao === false && (
          <View style={styles.avisoCard}>
            <Ionicons name="warning" size={24} color="#FF9800" />
            <Text style={styles.avisoTexto}>
              Permissão de localização necessária para receber tickets
            </Text>
            <TouchableOpacity
              style={styles.botaoPermissao}
              onPress={verificarPermissaoLocalizacao}
            >
              <Text style={styles.botaoPermissaoTexto}>
                Conceder Permissão
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  statusSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  botoesContainer: {
    gap: 12,
  },
  botaoSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  botaoSimular: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  botaoPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  botaoTextoSecundario: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  botaoTextoPrincipal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  avisoCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  avisoTexto: {
    fontSize: 14,
    color: '#E65100',
    textAlign: 'center',
    marginVertical: 10,
  },
  botaoPermissao: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  botaoPermissaoTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default TelaLocalizacao;

