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
import { colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { tokenService } from '../../services/tokenService';
import { authService } from '../../services/authService';
import styles from './styles';

export default function ConfiguracoesAluno({ navigation }) {
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
    nome: userData?.nome || 'Aluno',
    telefone: userData?.telefone || 'Sem telefone',
    rg: userData?.rg_aluno || 'Sem RG',
  };

  const iniciais = usuario.nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || '')
    .join('') || 'AL';

  const OptionItem = ({ icone, titulo, subtitulo, onPress, valor, isSwitch, isDanger, loading = false }) => (
    <TouchableOpacity 
      style={styles.cardOpcao} 
      onPress={onPress} 
      disabled={isSwitch || loading}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
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
    Alert.alert("Sair", "Deseja realmente sair da conta?", [
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
        <View style={styles.topHeader}>
          <Text style={styles.titulo}>Ajustes</Text>
          <Text style={styles.subtitulo}>Gerencie sua conta e preferÃªncias</Text>
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.perfilCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>{iniciais}</Text>
            </View>
            <View style={styles.perfilInfo}>
              <Text style={styles.nomeUsuario}>{usuario.nome}</Text>
              <Text style={styles.emailUsuario}>{usuario.telefone}</Text>
              <View style={styles.badgeMatricula}>
                  <Text style={styles.matriculaTexto}>RG: {usuario.rg}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.secaoTitulo}>SEGURANÃ‡A E ACESSO</Text>
          <View style={styles.grupoCards}>
            <OptionItem 
              icone="finger-print-outline" 
              titulo="Acesso por Biometria" 
              subtitulo="Usar FaceID ou Digital para entrar"
              isSwitch
              valor={biometriaAtiva}
              loading={biometriaLoading}
              onPress={handleToggleBiometria}
            />
            <OptionItem 
              icone="lock-closed-outline" 
              titulo="Alterar Senha" 
              onPress={() => navigation.navigate('alteracaoSenha')}
            />
            <OptionItem 
              icone="log-out-outline" 
              titulo="Sair da Conta" 
              subtitulo="Encerrar sua sessao neste dispositivo"
              isDanger
              onPress={handleLogout}
            />
          </View>

        {/* SEÃ‡ÃƒO: PREFERÃŠNCIAS */}
        {/* <Text style={styles.secaoTitulo}>PREFERÃŠNCIAS</Text>
        <View style={styles.grupoCards}>
          <OptionItem 
            icone="notifications-outline" 
            titulo="NotificaÃ§Ãµes Push" 
            subtitulo="Alertas de treinos e mensalidades"
            isSwitch
            valor={notificacoesAtivas}
            onPress={() => setNotificacoesAtivas(!notificacoesAtivas)}
          />
          <OptionItem 
            icone="color-palette-outline" 
            titulo="Tema do Aplicativo" 
            subtitulo="Claro / Escuro"
            onPress={() => {}}
          />
        </View> */}

        {/* SEÃ‡ÃƒO: SUPORTE */}
        {/* <Text style={styles.secaoTitulo}>ESCOLINHA</Text>
        <View style={styles.grupoCards}>
          <OptionItem 
            icone="help-circle-outline" 
            titulo="Ajuda e Suporte" 
            onPress={() => {}}
          />
          <OptionItem 
            icone="document-text-outline" 
            titulo="Termos de Uso" 
            onPress={() => {}}
          />
        </View> */}

          <Text style={styles.versao}>VersÃ£o 1.0.4 (Beta)</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


