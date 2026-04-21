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

export default function ConfiguracoesProfessor({ navigation }) {
  const [biometriaAtiva, setBiometriaAtiva] = useState(true);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const { signOut, userData } = useAuth();

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

  const OptionItem = ({ icone, titulo, subtitulo, onPress, valor, isSwitch, isDestak, isDanger }) => (
    <TouchableOpacity 
      style={styles.cardOpcao} 
      onPress={onPress} 
      disabled={isSwitch}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconWrapper,
          isDestak && { backgroundColor: '#eff6ff' },
          isDanger && { backgroundColor: '#fef2f2' },
        ]}
      >
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
          <OptionItem 
            icone="card-outline" 
            titulo="Ajustes de Cobrança" 
            subtitulo="Valor, vencimento e total de aulas"
            isDestak
            onPress={() => navigation.navigate('configuracoes')}
          />
        </View>

        {/* SEÇÃO: SEGURANÇA (RF015) */}
        <Text style={styles.secaoTitulo}>SEGURANÇA E ACESSO</Text>
        <View style={styles.grupoCards}>
          <OptionItem 
            icone="finger-print-outline" 
            titulo="Acesso por Biometria" 
            subtitulo="Digital ou FaceID para funções sensíveis"
            isSwitch
            valor={biometriaAtiva}
            onPress={() => setBiometriaAtiva(!biometriaAtiva)}
          />
          <OptionItem 
            icone="key-outline" 
            titulo="Senha Administrativa" 
            subtitulo="Alterar senha de acesso ao painel"
            onPress={() => navigation.navigate('alteracaoSenha')}
          />
          <OptionItem 
            icone="log-out-outline" 
            titulo="Encerrar Sessão" 
            subtitulo="Sair da conta administrativa"
            isDanger
            onPress={handleLogout}
          />
        </View>

        <Text style={styles.versao}>Versão Admin 1.0.4 • 2026</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 100, marginBottom: 20 },
  titulo: { fontSize: 32, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: colors.textPlaceholder, marginTop: 4 },

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
    width: 65, height: 65, borderRadius: 20,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'
  },
  avatarTexto: { color: '#fff', fontSize: 22, fontWeight: '800' },
  perfilInfo: { marginLeft: 15, flex: 1 },
  nomeUsuario: { fontSize: 17, fontWeight: '800', color: colors.primary },
  emailUsuario: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  badgeCargo: { 
    backgroundColor: '#e2e8f0', alignSelf: 'flex-start', 
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 8 
  },
  cargoTexto: { fontSize: 9, fontWeight: '900', color: '#475569' },

  secaoTitulo: { 
    fontSize: 11, fontWeight: '900', color: colors.textPlaceholder, 
    marginLeft: 20, marginTop: 20, marginBottom: 10, letterSpacing: 1 
  },
  grupoCards: { marginHorizontal: 20, backgroundColor: '#fff' },
  cardOpcao: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9'
  },
  iconWrapper: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center'
  },
  opcaoTitulo: { fontSize: 15, fontWeight: '700', color: colors.primaryDark },
  opcaoTituloDanger: { color: '#dc2626' },
  opcaoSubtitulo: { fontSize: 12, color: colors.textPlaceholder, marginTop: 2 },

  versao: { textAlign: 'center', color: '#cbd5e1', fontSize: 11, marginTop: 20, marginBottom: 20 }
});