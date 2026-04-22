import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { colors } from '../../global/colors';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../../components/InputField';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import styles from './styles';

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
        !temMaipuscula ? 'MÃ­nimo 1 letra maiÃºscula' : null,
        !temMinuscula ? 'MÃ­nimo 1 letra minÃºscula' : null,
        !temNumero ? 'MÃ­nimo 1 nÃºmero' : null,
        temEspacoOuCaractereEspecial ? 'Sem espaÃ§os em branco' : null,
        senha.length < 8 ? 'MÃ­nimo 8 caracteres' : null,
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
      novosErros.senhaNovaConfirm = 'As senhas nÃ£o coincidem';
    }

    if (senhaAtual && senhaNova && senhaAtual === senhaNova) {
      novosErros.senhaNova = 'NÃ£o pode ser igual Ã  senha atual';
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
          <ActivityIndicator size="large" color={colors.primary} />
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
            variante="senha"
          />

          <InputField
            label="Nova Senha"
            obrigatorio
            placeholder="Digite a nova senha"
            value={senhaNova}
            onChangeText={v => setField('senhaNova', v)}
            erro={erros.senhaNova}
            variante="senha"
          />

          <InputField
            label="Confirmar Nova Senha"
            obrigatorio
            placeholder="Confirme a nova senha"
            value={senhaNovaConfirm}
            onChangeText={v => setField('senhaNovaConfirm', v)}
            erro={erros.senhaNovaConfirm}
            variante="senha"
          />

          {sucesso && (
            <View style={styles.sucessoBox}>
              <Text style={styles.sucessoTexto}>âœ“ Senha alterada com sucesso!</Text>
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

