import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { colors } from '../../constants/colors';
import InputField from '../../components/InputField';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import AppAlertModal from '../../components/AppAlertModal';
import styles from './styles';

export default function AlteracaoSenha({ navigation }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaNovaConfirm, setSenhaNovaConfirm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [erros, setErros] = useState({});
  const [alertErro, setAlertErro] = useState({ visible: false, title: '', message: '' });
  const [alertSucesso, setAlertSucesso] = useState({ visible: false, title: '', message: '' });
  const { userData } = useAuth();

  const validarSenha = (senha) => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspacoOuCaractereEspecial = /[\s]/.test(senha);

    return {
      valida: temMaiuscula && temMinuscula && temNumero && !temEspacoOuCaractereEspecial && senha.length >= 8,
      erros: [
        !temMaiuscula ? 'Mínimo 1 letra maiúscula' : null,
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
    if (isSaving) {
      return;
    }

    if (!validar()) {
      return;
    }

    try {
      setIsSaving(true);
      let atualizouComSucesso = false;

      await authService.atualizarSenha(
        userData?.id,
        senhaAtual,
        senhaNova
      );

      setSenhaAtual('');
      setSenhaNova('');
      setSenhaNovaConfirm('');

      atualizouComSucesso = true;

      setAlertSucesso({
        visible: true,
        title: 'Senha alterada com sucesso',
        message: 'Sua senha foi atualizada com sucesso.',
      });

      return atualizouComSucesso;
    } catch (erro) {
      const mensagem = erro?.response?.data?.mensagem || erro?.message || 'Erro ao alterar senha';
      setAlertErro({
        visible: true,
        title: 'Erro',
        message: mensagem,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={110}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.titulo}>Alterar Senha</Text>
            <Text style={styles.subtitulo}>Mantenha sua conta segura</Text>
          </View>

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

          <TouchableOpacity
            style={[styles.botaoSalvar, isSaving ? { opacity: 0.8 } : null]}
            activeOpacity={0.85}
            onPress={handleAlterarSenha}
            disabled={isSaving}
          >
            {isSaving ? (
              <View style={styles.botaoSalvarConteudo}>
                <ActivityIndicator size="small" color={colors.textInverted} />
                <Text style={styles.botaoSalvarTexto}>Salvando...</Text>
              </View>
            ) : (
              <Text style={styles.botaoSalvarTexto}>Alterar Senha</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppAlertModal
        visible={alertErro.visible}
        title={alertErro.title}
        message={alertErro.message}
        variant="error"
        onRequestClose={() => setAlertErro({ visible: false, title: '', message: '' })}
      />

      <AppAlertModal
        visible={alertSucesso.visible}
        title={alertSucesso.title}
        message={alertSucesso.message}
        variant="success"
        onRequestClose={() => {
          setAlertSucesso({ visible: false, title: '', message: '' });
          if (navigation?.canGoBack?.()) {
            navigation.goBack();
          }
        }}
      />
    </SafeAreaView>
  );
}




