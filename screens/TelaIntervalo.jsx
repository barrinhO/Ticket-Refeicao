import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TelaIntervalo = ({ navigation }) => {
  const [tempoAtual, setTempoAtual] = useState(new Date());
  const [intervaloAtivo, setIntervaloAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState('');
  const [proximoIntervalo, setProximoIntervalo] = useState(null);

  // Configuração dos horários de intervalo
  const horariosIntervalo = [
    { inicio: '09:25', fim: '09:45', nome: 'Intervalo da Manhã' },
    { inicio: '15:25', fim: '15:45', nome: 'Intervalo da Tarde' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
      setTempoAtual(agora);
      verificarIntervalo(agora);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const verificarIntervalo = (agora) => {
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();
    const tempoAtualMinutos = horaAtual * 60 + minutoAtual;

    let intervaloEncontrado = false;
    let proximoIntervaloInfo = null;
    let menorDiferenca = Infinity;

    horariosIntervalo.forEach((intervalo) => {
      const [horaInicio, minutoInicio] = intervalo.inicio.split(':').map(Number);
      const [horaFim, minutoFim] = intervalo.fim.split(':').map(Number);
      
      const inicioMinutos = horaInicio * 60 + minutoInicio;
      const fimMinutos = horaFim * 60 + minutoFim;

      // Verifica se está dentro do intervalo
      if (tempoAtualMinutos >= inicioMinutos && tempoAtualMinutos <= fimMinutos) {
        setIntervaloAtivo(true);
        intervaloEncontrado = true;
        
        const minutosRestantes = fimMinutos - tempoAtualMinutos;
        const horas = Math.floor(minutosRestantes / 60);
        const minutos = minutosRestantes % 60;
        
        if (horas > 0) {
          setTempoRestante(`${horas}h ${minutos}min para acabar`);
        } else {
          setTempoRestante(`${minutos}min para acabar`);
        }
        return;
      }

      // Calcula o próximo intervalo
      let diferencaParaInicio;
      if (tempoAtualMinutos < inicioMinutos) {
        diferencaParaInicio = inicioMinutos - tempoAtualMinutos;
      } else {
        // Próximo dia
        diferencaParaInicio = (24 * 60) - tempoAtualMinutos + inicioMinutos;
      }

      if (diferencaParaInicio < menorDiferenca) {
        menorDiferenca = diferencaParaInicio;
        proximoIntervaloInfo = {
          ...intervalo,
          minutosRestantes: diferencaParaInicio,
        };
      }
    });

    if (!intervaloEncontrado) {
      setIntervaloAtivo(false);
      setProximoIntervalo(proximoIntervaloInfo);
      
      if (proximoIntervaloInfo) {
        const horas = Math.floor(proximoIntervaloInfo.minutosRestantes / 60);
        const minutos = proximoIntervaloInfo.minutosRestantes % 60;
        
        if (horas > 0) {
          setTempoRestante(`${horas}h ${minutos}min para começar`);
        } else {
          setTempoRestante(`${minutos}min para começar`);
        }
      }
    }
  };

  const formatarHora = (data) => {
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const podeReceberTicket = () => {
    if (!proximoIntervalo) return false;
    
    // Verifica se está nos 5 minutos antes do intervalo
    return proximoIntervalo.minutosRestantes <= 5 && proximoIntervalo.minutosRestantes > 0;
  };

  const irParaReceberTicket = () => {
    if (podeReceberTicket()) {
      navigation.navigate('ReceberTicket');
    } else {
      Alert.alert(
        'Atenção',
        'Você só pode receber tickets nos 5 minutos antes do intervalo começar!'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      <LinearGradient
        colors={['#4A90E2', '#357ABD', '#2E6BA8']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Status do Intervalo</Text>
        <Text style={styles.dataAtual}>{formatarData(tempoAtual)}</Text>
        <Text style={styles.horaAtual}>{formatarHora(tempoAtual)}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={[
          styles.statusCard,
          { backgroundColor: intervaloAtivo ? '#4CAF50' : '#FF9800' }
        ]}>
          <Ionicons 
            name={intervaloAtivo ? "checkmark-circle" : "time"} 
            size={48} 
            color="white" 
          />
          <Text style={styles.statusTitle}>
            {intervaloAtivo ? 'INTERVALO ATIVO' : 'INTERVALO INATIVO'}
          </Text>
          <Text style={styles.statusSubtitle}>
            {intervaloAtivo 
              ? (proximoIntervalo ? proximoIntervalo.nome : 'Intervalo em andamento')
              : (proximoIntervalo ? proximoIntervalo.nome : 'Aguardando próximo intervalo')
            }
          </Text>
        </View>

        <View style={styles.tempoCard}>
          <Text style={styles.tempoLabel}>
            {intervaloAtivo ? 'Tempo restante:' : 'Próximo intervalo em:'}
          </Text>
          <Text style={styles.tempoValor}>{tempoRestante}</Text>
        </View>

        {proximoIntervalo && !intervaloAtivo && (
          <View style={styles.proximoIntervaloCard}>
            <Text style={styles.proximoIntervaloTitle}>Próximo Intervalo</Text>
            <Text style={styles.proximoIntervaloHorario}>
              {proximoIntervalo.inicio} - {proximoIntervalo.fim}
            </Text>
            <Text style={styles.proximoIntervaloNome}>
              {proximoIntervalo.nome}
            </Text>
          </View>
        )}

        <View style={styles.horariosContainer}>
          <Text style={styles.horariosTitle}>Horários dos Intervalos</Text>
          {horariosIntervalo.map((intervalo, index) => (
            <View key={index} style={styles.horarioItem}>
              <Text style={styles.horarioNome}>{intervalo.nome}</Text>
              <Text style={styles.horarioHora}>
                {intervalo.inicio} - {intervalo.fim}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.botaoTicket,
            { 
              backgroundColor: podeReceberTicket() ? '#4CAF50' : '#CCCCCC',
              opacity: podeReceberTicket() ? 1 : 0.6 
            }
          ]}
          onPress={irParaReceberTicket}
          disabled={!podeReceberTicket()}
        >
          <Ionicons 
            name="restaurant" 
            size={24} 
            color="white" 
            style={styles.botaoIcon}
          />
          <Text style={styles.botaoTexto}>
            {podeReceberTicket() ? 'Receber Ticket' : 'Aguarde o Horário'}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 8,
  },
  dataAtual: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  horaAtual: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'monospace',
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
  tempoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  tempoLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  tempoValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  proximoIntervaloCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  proximoIntervaloTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  proximoIntervaloHorario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  proximoIntervaloNome: {
    fontSize: 14,
    color: '#666',
  },
  horariosContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
  },
  horariosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  horarioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  horarioNome: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  horarioHora: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  botaoTicket: {
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
  botaoIcon: {
    marginRight: 8,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default TelaIntervalo;

