import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../../components/InputField';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function AlteracaoSenha({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaNovaConfirm, setSenhaNovaConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState(false);
  const { userData } = useAuth();

  const validarSenha = (senha) => {
    const temMaipuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspacoOuCaractereEspecial = /[\s]/.test(senha);

    return {
      valida: temMaipuscula && temMinuscula && temNumero && !temEspacoOuCaractereEspecial && senha.length >= 8,
      erros: [
        !temMaipuscula ? 'Mínimo 1 letra maiúscula' : null,
        !temMinuscula ? 'Mínimo 1 letra minúscula' : null,
        !temNumero ? 'Mínimo 1 número' : null,
        temEspacoOuCaractereEspecial ? 'Sem espaços em branco' : null,
        senha.length < 8 ? 'Mínimo 8 caracteres' : null,
      ].filter(Boolean),
    };
  };

  const setField = (campo, valor) => {
    if (campo === 'senhaAtual') setSenhaAtual(valor);
    if (campo === 'senhaNova') setSenhaNova(valor);
    if (campo === 'senhaNovaConfirm') setSenhaNovaConfirm(valor);
    setErros(prev => ({ ...prev, [campo]: '' }));
  };

  const validar = () => {
    const novosErros = {};

    if (!senhaAtual.trim()) {
      novosErros.senhaAtual = 'Informe sua senha atual';
    }

    if (!senhaNova.trim()) {
      novosErros.senhaNova = 'Informe a nova senha';
    }

    if (!senhaNovaConfirm.trim()) {
      novosErros.senhaNovaConfirm = 'Confirme a nova senha';
    }

    if (senhaNova && senhaNovaConfirm && senhaNova !== senhaNovaConfirm) {
      novosErros.senhaNovaConfirm = 'As senhas não coincidem';
    }

    if (senhaAtual && senhaNova && senhaAtual === senhaNova) {
      novosErros.senhaNova = 'Não pode ser igual à senha atual';
    }

    const validacao = validarSenha(senhaNova);
    if (senhaNova && !validacao.valida) {
      novosErros.senhaNova = validacao.erros.join('\n');
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleAlterarSenha = async () => {
    if (!validar()) {
      return;
    }

    try {
      setLoading(true);
      setSucesso(false);

      await authService.atualizarSenha(
        userData?.id,
        senhaAtual,
        senhaNova
      );

      setSucesso(true);
      setSenhaAtual('');
      setSenhaNova('');
      setSenhaNovaConfirm('');

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (erro) {
      const mensagem = erro?.response?.data?.mensagem || erro?.message || 'Erro ao alterar senha';
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setSenhaAtual('');
    setSenhaNova('');
    setSenhaNovaConfirm('');
    setErros({});
    setSucesso(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && !sucesso ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.azul} />
          <Text style={styles.loadingText}>Atualizando senha...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Alterar Senha</Text>
            <Text style={styles.subtitulo}>Mantenha sua conta segura</Text>
          </View>

          {/* INPUTS */}
          <InputField
            label="Senha Atual"
            obrigatorio
            placeholder="Digite sua senha atual"
            value={senhaAtual}
            onChangeText={v => setField('senhaAtual', v)}
            erro={erros.senhaAtual}
            secureTextEntry
          />

          <InputField
            label="Nova Senha"
            obrigatorio
            placeholder="Digite a nova senha"
            value={senhaNova}
            onChangeText={v => setField('senhaNova', v)}
            erro={erros.senhaNova}
            secureTextEntry
          />

          {senhaNova && (
            <View style={styles.requisitosCard}>
              <Text style={styles.requisitosTitle}>Requisitos:</Text>
              {[
                { label: 'Mínimo 8 caracteres', check: senhaNova.length >= 8 },
                { label: '1 letra maiúscula', check: /[A-Z]/.test(senhaNova) },
                { label: '1 letra minúscula', check: /[a-z]/.test(senhaNova) },
                { label: '1 número', check: /[0-9]/.test(senhaNova) },
                { label: 'Sem espaços', check: !/[\s]/.test(senhaNova) },
              ].map((req, idx) => (
                <View key={idx} style={styles.requisito}>
                  <Ionicons
                    name={req.check ? 'checkmark-circle' : 'close-circle'}
                    size={16}
                    color={req.check ? '#16a34a' : '#cbd5e1'}
                  />
                  <Text style={[styles.requisitoTexto, { color: req.check ? '#16a34a' : '#cbd5e1' }]}>
                    {req.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <InputField
            label="Confirmar Nova Senha"
            obrigatorio
            placeholder="Confirme a nova senha"
            value={senhaNovaConfirm}
            onChangeText={v => setField('senhaNovaConfirm', v)}
            erro={erros.senhaNovaConfirm}
            secureTextEntry
          />

          {sucesso && (
            <View style={styles.sucessoBox}>
              <Text style={styles.sucessoTexto}>✓ Senha alterada com sucesso!</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.botaoSalvar}
            activeOpacity={0.85}
            onPress={handleAlterarSenha}
            disabled={loading}
          >
            <Text style={styles.botaoSalvarTexto}>Alterar Senha</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 50,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navBotaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.azulPalido,
    borderWidth: 1.5,
    borderColor: colors.azulMedio,
  },
  navTextoVoltar: {
    fontSize: 14,
    color: colors.azul,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 10,
  },
  iconeBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.azul,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  iconeTexto: {
    fontSize: 28,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.azul,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 16,
    color: colors.azul,
    fontWeight: '600',
  },
  requisitosCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
  },
  requisitosTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.azul,
    marginBottom: 8,
  },
  requisito: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  requisitoTexto: {
    fontSize: 12,
    fontWeight: '500',
  },
  sucessoBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  sucessoTexto: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '600',
  },
  botaoSalvar: {
    backgroundColor: colors.azul,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoSalvarTexto: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
