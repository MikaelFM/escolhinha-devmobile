import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { tokenService } from '../../services/tokenService';
import { authService } from '../../services/authService';
import { obterIniciaisNome } from '../../utils/formatters';
import { validarDisponibilidadeBiometriaComAlertas } from '../../utils/biometria';
import SettingsOptionItem from '../../components/SettingsOptionItem';
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

  const handleToggleBiometria = async () => {
    if (biometriaLoading) return;

    setBiometriaLoading(true);
    const novoValor = !biometriaAtiva;

    try {
      if (novoValor) {
        const podeAtivar = await validarDisponibilidadeBiometriaComAlertas();
        if (!podeAtivar) {
          return;
        }

        try {
          const ativacao = await authService.ativarLoginBiometria();
          if (!ativacao?.sucesso) {
            Alert.alert('Falha ao ativar', 'Servidor não retornou token biométrico para este dispositivo.');
            return;
          }
        } catch (erroAtivacao) {
          Alert.alert(
            'Falha ao ativar',
            erroAtivacao?.message || 'Não foi possível ativar o login biométrico agora. Tente novamente.'
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

  const iniciais = obterIniciaisNome(usuario.nome, 'AL');

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
          <Text style={styles.subtitulo}>Gerencie sua conta e preferências</Text>
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

          <Text style={styles.secaoTitulo}>SEGURANÇA E ACESSO</Text>
          <View style={styles.grupoCards}>
            <SettingsOptionItem
              styles={styles}
              icone="finger-print-outline" 
              titulo="Acesso por Biometria" 
              subtitulo="Usar FaceID ou Digital para entrar"
              isSwitch
              valor={biometriaAtiva}
              loading={biometriaLoading}
              onPress={handleToggleBiometria}
            />
            <SettingsOptionItem
              styles={styles}
              icone="lock-closed-outline" 
              titulo="Alterar Senha" 
              onPress={() => navigation.navigate('alteracaoSenha')}
            />
            <SettingsOptionItem
              styles={styles}
              icone="log-out-outline" 
              titulo="Sair da Conta" 
              subtitulo="Encerrar sua sessão neste dispositivo"
              isDanger
              onPress={handleLogout}
            />
          </View>

        {/* SEÇÃO: PREFERÊNCIAS */}
        {/* <Text style={styles.secaoTitulo}>PREFERÊNCIAS</Text>
        <View style={styles.grupoCards}>
          <OptionItem 
            icone="notifications-outline" 
            titulo="Notificações Push" 
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

        {/* SEÇÃO: SUPORTE */}
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

          <Text style={styles.versao}>Versão 1.0.4 (Beta)</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}




