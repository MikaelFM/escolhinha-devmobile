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
    nome: userData?.nome || 'Administrador',
    telefone: userData?.telefone || 'Sem telefone',
    cargo: 'ADMINISTRADOR',
  };

  const iniciais = obterIniciaisNome(usuario.nome, 'AD');

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja encerrar a sessão administrativa?", [
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
          <Text style={styles.subtitulo}>Gestão administrativa do sistema</Text>
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

        {/* SEÇÃO: GESTÃO DA ESCOLINHA (RF008) */}
        <Text style={styles.secaoTitulo}>GESTÃO DA ESCOLINHA</Text>
        <View style={styles.grupoCards}>
          <SettingsOptionItem
            styles={styles}
            icone="card-outline" 
            titulo="Ajustes de Cobrança" 
            subtitulo="Valor, vencimento e total de aulas"
            onPress={() => navigation.navigate('configuracoes')}
          />
        </View>

        {/* SEÇÃO: SEGURANÇA (RF015) */}
        <Text style={styles.secaoTitulo}>SEGURANÇA E ACESSO</Text>
        <View style={styles.grupoCards}>
          <SettingsOptionItem
            styles={styles}
            icone="finger-print-outline" 
            titulo="Acesso por Biometria" 
            subtitulo="Digital ou FaceID para funções sensíveis"
            isSwitch
            valor={biometriaAtiva}
            loading={biometriaLoading}
            onPress={handleToggleBiometria}
          />
          <SettingsOptionItem
            styles={styles}
            icone="key-outline" 
            titulo="Senha Administrativa" 
            subtitulo="Alterar senha de acesso ao painel"
            onPress={() => navigation.navigate('alteracaoSenha')}
          />
          <SettingsOptionItem
            styles={styles}
            icone="log-out-outline" 
            titulo="Encerrar Sessão" 
            subtitulo="Sair da conta administrativa"
            isDanger
            dangerIconBackground
            onPress={handleLogout}
          />
        </View>

        <Text style={styles.versao}>Versão Admin 1.0.4 • 2026</Text>

      </ScrollView>
    </SafeAreaView>
  );
}


