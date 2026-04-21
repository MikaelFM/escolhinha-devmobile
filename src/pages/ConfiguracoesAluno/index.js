import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function ConfiguracoesAluno({ navigation }) {
  const [biometriaAtiva, setBiometriaAtiva] = useState(true);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const { signOut, userData } = useAuth();

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

  const OptionItem = ({ icone, titulo, subtitulo, onPress, valor, isSwitch, isDanger }) => (
    <TouchableOpacity 
      style={styles.cardOpcao} 
      onPress={onPress} 
      disabled={isSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={icone} size={22} color={isDanger ? colors.error : colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={[styles.opcaoTitulo, isDanger && styles.opcaoTituloDanger]}>{titulo}</Text>
        {subtitulo && <Text style={styles.opcaoSubtitulo}>{subtitulo}</Text>}
      </View>
      {isSwitch ? (
        <Switch
          trackColor={{ false: '#cbd5e1', true: '#bbf7d0' }}
          thumbColor={valor ? '#16a34a' : '#94a3b8'}
          onValueChange={onPress}
          value={valor}
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
            <OptionItem 
              icone="finger-print-outline" 
              titulo="Acesso por Biometria" 
              subtitulo="Usar FaceID ou Digital para entrar"
              isSwitch
              valor={biometriaAtiva}
              onPress={() => setBiometriaAtiva(!biometriaAtiva)}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topHeader: { paddingHorizontal: 20, paddingTop: 80, marginBottom: 14 },
  titulo: { fontSize: 32, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: colors.textPlaceholder, marginTop: 4 },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },

  perfilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarTexto: { color: '#fff', fontSize: 22, fontWeight: '800' },
  perfilInfo: { marginLeft: 15, flex: 1 },
  nomeUsuario: { fontSize: 17, fontWeight: '800', color: colors.primaryDark },
  emailUsuario: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  badgeMatricula: { 
    backgroundColor: '#e2e8f0', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 6, 
    marginTop: 8 
  },
  matriculaTexto: { fontSize: 10, fontWeight: '800', color: '#475569' },

  secaoTitulo: { 
    fontSize: 11, 
    fontWeight: '900', 
    color: colors.textPlaceholder, 
    marginLeft: 20, 
    marginTop: 20, 
    marginBottom: 10, 
    letterSpacing: 1 
  },
  grupoCards: { marginHorizontal: 20, backgroundColor: 'transparent' },
  cardOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginBottom: 10,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  opcaoTitulo: { fontSize: 15, fontWeight: '700', color: colors.primaryDark },
  opcaoTituloDanger: { color: '#dc2626' },
  opcaoSubtitulo: { fontSize: 12, color: colors.textPlaceholder, marginTop: 2 },
  versao: { textAlign: 'center', color: '#cbd5e1', fontSize: 12, marginTop: 16 }
});