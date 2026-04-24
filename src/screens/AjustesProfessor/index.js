import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { tokenService } from '../../services/tokenService';
import { APP_VERSION } from '../../constants';
import { authService } from '../../services/authService';
import { validarDisponibilidadeBiometriaComAlertas } from '../../utils/biometria';
import SettingsOptionItem from '../../components/SettingsOptionItem';
import AppAlertModal from '../../components/AppAlertModal';
import styles from './styles';

export default function AjustesProfessor({ navigation }) {
  const [biometriaAtiva, setBiometriaAtiva] = useState(true);
  const [biometriaLoading, setBiometriaLoading] = useState(false);
  const [alertErro, setAlertErro] = useState({ visible: false, title: '', message: '' });
  const [alertSair, setAlertSair] = useState(false);
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
        const disponibilidade = await validarDisponibilidadeBiometriaComAlertas();
        if (!disponibilidade?.disponivel) {
          setAlertErro({
            visible: true,
            title: disponibilidade?.title || 'Atenção',
            message: disponibilidade?.message || 'Não foi possível validar biometria.',
          });
          return;
        }

        try {
          const ativacao = await authService.ativarLoginBiometria();
          if (!ativacao?.sucesso) {
            setAlertErro({
              visible: true,
              title: 'Falha ao ativar',
              message: 'Servidor não retornou token biométrico para este dispositivo.',
            });
            return;
          }
        } catch (erroAtivacao) {
          setAlertErro({
            visible: true,
            title: 'Falha ao ativar',
            message: erroAtivacao?.message || 'Não foi possível ativar o login biométrico agora. Tente novamente.',
          });
          return;
        }
      }

      setBiometriaAtiva(novoValor);
      await tokenService.salvarPreferenciaBiometria(novoValor);
    } finally {
      setBiometriaLoading(false);
    }
  };

  const handleLogout = () => {
    setAlertSair(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={styles.header}>
          <Text style={styles.titulo}>Ajustes</Text>
          <Text style={styles.subtitulo}>Gestão administrativa do sistema</Text>
        </View>

        {/* SEÇÃO: GESTÃO DA ESCOLINHA */}
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

        <Text style={styles.versao}>Versão {APP_VERSION}</Text>

      </ScrollView>

      <AppAlertModal
        visible={alertErro.visible}
        title={alertErro.title}
        message={alertErro.message}
        variant="error"
        onRequestClose={() => setAlertErro({ visible: false, title: '', message: '' })}
      />

      <AppAlertModal
        visible={alertSair}
        title="Sair"
        message="Deseja encerrar a sessão administrativa?"
        variant="warning"
        actions={[
          { label: 'Cancelar', variant: 'secondary' },
          {
            label: 'Sair',
            onPress: async () => { await signOut(); },
          },
        ]}
        onRequestClose={() => setAlertSair(false)}
      />
    </SafeAreaView>
  );
}


