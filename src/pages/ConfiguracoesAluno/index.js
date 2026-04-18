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

  const OptionItem = ({ icone, titulo, subtitulo, onPress, valor, isSwitch }) => (
    <TouchableOpacity 
      style={styles.cardOpcao} 
      onPress={onPress} 
      disabled={isSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={icone} size={22} color={colors.azul} />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.opcaoTitulo}>{titulo}</Text>
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
        
        {/* HEADER PADRONIZADO */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Ajustes</Text>
          <Text style={styles.subtitulo}>Gerencie sua conta e preferências</Text>
        </View>

        {/* CARD DE PERFIL EXPONENCIAL */}
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

        {/* SEÇÃO: SEGURANÇA (RF015) */}
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

        {/* BOTÃO SAIR */}
        <TouchableOpacity style={styles.btnSair} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={styles.btnSairTexto}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={styles.versao}>Versão 1.0.4 (Beta)</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { paddingHorizontal: 20, paddingTop: 80, marginBottom: 20 },
  titulo: { fontSize: 32, fontWeight: '800', color: colors.azul, letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, color: '#94a3b8', marginTop: 4 },

  perfilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: colors.azul,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarTexto: { color: '#fff', fontSize: 22, fontWeight: '800' },
  perfilInfo: { marginLeft: 15, flex: 1 },
  nomeUsuario: { fontSize: 17, fontWeight: '800', color: colors.azul },
  emailUsuario: { fontSize: 13, color: '#64748b', marginTop: 2 },
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
    color: '#94a3b8', 
    marginLeft: 20, 
    marginTop: 20, 
    marginBottom: 10, 
    letterSpacing: 1 
  },
  grupoCards: { marginHorizontal: 20, backgroundColor: '#fff' },
  cardOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  opcaoTitulo: { fontSize: 15, fontWeight: '700', color: colors.azul },
  opcaoSubtitulo: { fontSize: 12, color: '#94a3b8', marginTop: 2 },

  btnSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 15,
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    gap: 10
  },
  btnSairTexto: { fontSize: 16, fontWeight: '800', color: '#dc2626' },
  versao: { textAlign: 'center', color: '#cbd5e1', fontSize: 12, marginTop: 20 }
});