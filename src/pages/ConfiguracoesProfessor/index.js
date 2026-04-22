import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { tokenService } from '../../services/tokenService';
import { authService } from '../../services/authService';
import styles from './styles';

export default function ConfiguracoesProfessor({ navigation }) {
  const [biometriaAtiva, setBiometriaAtiva] = useState(true);
  const [biometriaLoading, setBiometriaLoading] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const { signOut, userData } = useAuth();

  useEffect(() => {
    const carregarPreferenciaBiometria = async () => {
      const preferencia = await tokenService.obterPreferenciaBiometria();
      setBiometriaAtiva(preferencia);
    };

    carregarPreferenciaBiometria();
  }, []);

  const validarDisponibilidadeBiometria = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Biometria indisponÃ­vel', 'Este dispositivo nÃ£o possui suporte para biometria.');
      return false;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert('Biometria nÃ£o configurada', 'Cadastre sua digital ou Face ID nas configuraÃ§Ãµes do aparelho.');
      return false;
    }

    return true;
  };

  const handleToggleBiometria = async () => {
    if (biometriaLoading) return;

    setBiometriaLoading(true);
    const novoValor = !biometriaAtiva;

    try {
      if (novoValor) {
        const podeAtivar = await validarDisponibilidadeBiometria();
        if (!podeAtivar) {
          return;
        }

        try {
          const ativacao = await authService.ativarLoginBiometria();
          if (!ativacao?.sucesso) {
            Alert.alert('Falha ao ativar', 'Servidor nÃ£o retornou token biomÃ©trico para este dispositivo.');
            return;
          }
        } catch (erroAtivacao) {
          Alert.alert(
            'Falha ao ativar',
            erroAtivacao?.message || 'NÃ£o foi possÃ­vel ativar o login biomÃ©trico agora. Tente novamente.'
          );
          return;
        }
      }

      setBiometriaAtiva(novoValor);
      await tokenService.salvarPreferenciaBiometria(novoValor);
    } finally {
      setBiometriaLoading(false);
    }
  };

  const usuario = {
    nome: userData?.nome || 'Administrador',
    telefone: userData?.telefone || 'Sem telefone',
    cargo: 'ADMINISTRADOR',
  };

  const iniciais = usuario.nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || '')
    .join('') || 'AD';

  const OptionItem = ({ icone, titulo, subtitulo, onPress, valor, isSwitch, isDestak, isDanger, loading = false }) => (
    <TouchableOpacity 
      style={styles.cardOpcao} 
      onPress={onPress} 
      disabled={isSwitch || loading}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconWrapper,
          isDanger && { backgroundColor: '#fef2f2' },
        ]}
      >
        <Ionicons name={icone} size={22} color={isDanger ? colors.error : colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={[styles.opcaoTitulo, isDanger && styles.opcaoTituloDanger]}>{titulo}</Text>
        {subtitulo && <Text style={styles.opcaoSubtitulo}>{subtitulo}</Text>}
      </View>
      {isSwitch && loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : isSwitch ? (
        <Switch
          trackColor={{ false: '#cbd5e1', true: colors.primaryBorder }}
          thumbColor={valor ? colors.primary : '#94a3b8'}
          onValueChange={onPress}
          value={valor}
          disabled={loading}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
      )}
    </TouchableOpacity>
  );

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja encerrar a sessÃ£o administrativa?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          await signOut();
        },
        style: "destructive"
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* HEADER PADRONIZADO */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Ajustes</Text>
          <Text style={styles.subtitulo}>GestÃ£o administrativa do sistema</Text>
        </View>

        {/* CARD DE PERFIL */}
        {/* <View style={styles.perfilCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{iniciais}</Text>
          </View>
          <View style={styles.perfilInfo}>
            <Text style={styles.nomeUsuario}>{usuario.nome}</Text>
            <Text style={styles.emailUsuario}>{usuario.telefone}</Text>
            <View style={styles.badgeCargo}>
                <Text style={styles.cargoTexto}>{usuario.cargo.toUpperCase()}</Text>
            </View>
          </View>
        </View> */}

        {/* SEÃ‡ÃƒO: GESTÃƒO DA ESCOLINHA (RF008) */}
        <Text style={styles.secaoTitulo}>GESTÃƒO DA ESCOLINHA</Text>
        <View style={styles.grupoCards}>
          <OptionItem 
            icone="card-outline" 
            titulo="Ajustes de CobranÃ§a" 
            subtitulo="Valor, vencimento e total de aulas"
            isDestak
            onPress={() => navigation.navigate('configuracoes')}
          />
        </View>

        {/* SEÃ‡ÃƒO: SEGURANÃ‡A (RF015) */}
        <Text style={styles.secaoTitulo}>SEGURANÃ‡A E ACESSO</Text>
        <View style={styles.grupoCards}>
          <OptionItem 
            icone="finger-print-outline" 
            titulo="Acesso por Biometria" 
            subtitulo="Digital ou FaceID para funÃ§Ãµes sensÃ­veis"
            isSwitch
            valor={biometriaAtiva}
            loading={biometriaLoading}
            onPress={handleToggleBiometria}
          />
          <OptionItem 
            icone="key-outline" 
            titulo="Senha Administrativa" 
            subtitulo="Alterar senha de acesso ao painel"
            onPress={() => navigation.navigate('alteracaoSenha')}
          />
          <OptionItem 
            icone="log-out-outline" 
            titulo="Encerrar SessÃ£o" 
            subtitulo="Sair da conta administrativa"
            isDanger
            onPress={handleLogout}
          />
        </View>

        <Text style={styles.versao}>VersÃ£o Admin 1.0.4 â€¢ 2026</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

