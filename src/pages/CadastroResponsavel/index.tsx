import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { maskApenasNumeros, maskTelefone, maskCPF } from '../../utils/masks';
import { validaObrigatorio, validaTelefone, validaEmail, validaCPF } from '../../utils/validators';
import InputField from '../../components/InputField';
import { colors } from '../../global/colors';

export default function CadastroResponsavel() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [sucesso, setSucesso] = useState(false);

  const setField = (campo: string, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErros(prev => ({ ...prev, [campo]: '' }));
  };

  const validar = () => {
    const novosErros: Record<string, string> = {
      nome:     validaObrigatorio(form.nome, 'Nome é obrigatório.'),
      email:    validaEmail(form.email),
      telefone: validaTelefone(form.telefone),
      cpf:      validaCPF ? validaCPF(form.cpf) : validaObrigatorio(form.cpf, 'CPF é obrigatório.'),
    };
    
    setErros(novosErros);
    return !Object.values(novosErros).some(Boolean);
  };

  const handleSalvar = () => {
    if (validar()) {
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>Cadastrar Responsável</Text>
          <Text style={styles.subtitulo}>Insira os dados para contato e faturamento</Text>
        </View>

        <View>
          <InputField
            label="Nome completo"
            obrigatorio
            placeholder="Ex: Cristiano Ronaldo"
            value={form.nome}
            onChangeText={v => setField('nome', v)}
            erro={erros.nome}
            autoCapitalize="words"
          />

          <InputField
            label="E-mail"
            obrigatorio
            placeholder="exemplo@email.com"
            value={form.email}
            onChangeText={v => setField('email', v)}
            erro={erros.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="CPF"
            obrigatorio
            placeholder="000.000.000-00"
            value={form.cpf}
            onChangeText={v => setField('cpf', v)}
            erro={erros.cpf}
            mascara={maskCPF}
            keyboardType="numeric"
          />

          <InputField
            label="Telefone celular"
            obrigatorio
            placeholder="(54) 98182-0000"
            value={form.telefone}
            onChangeText={v => setField('telefone', v)}
            erro={erros.telefone}
            mascara={maskTelefone}
            keyboardType="phone-pad"
          />

          {sucesso && (
            <View style={styles.sucessoBox}>
              <Text style={styles.sucessoTexto}>✓ Responsável cadastrado com sucesso!</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.botaoSalvar}
            activeOpacity={0.85}
            onPress={handleSalvar}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Responsável</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.azul,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  sucessoBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 12,
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
  },
});