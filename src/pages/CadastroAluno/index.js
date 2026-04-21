import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { maskApenasNumeros, maskCPF, maskData, maskTelefone } from '../../utils/masks';
import { validaCPF, validaData, validaObrigatorio, validaTelefone } from '../../utils/validators';
import InputField from '../../components/InputField';
import { colors } from '../../global/colors';
import { alunosService } from '../../services';
import { categoriasService } from '../../services/categoriasService';
import { responsavelService } from '../../services/responsavelService';
import { normalizarTexto } from '../../utils/formatters';

const FORM_INICIAL = {
  nome: '',
  rg: '',
  telefone: '',
  cpf_responsavel: '',
  nome_responsavel: '',
  telefone_responsavel: '',
  id_categoria: null,
  categoria: '',
  data_nascimento: '',
};

export default function CadastroAluno({ navigation, route }) {
  const idDaRota = route?.params?.id ?? route?.params?.rg ?? null;
  const modoEdicao = !!idDaRota;

  const [form, setForm] = useState(FORM_INICIAL);
  const [rgOriginal, setRgOriginal] = useState(idDaRota || '');
  const [erros, setErros] = useState({});
  const [modalCategoria, setModalCategoria] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [carregandoAluno, setCarregandoAluno] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    const carregarAluno = async () => {
      if (!idDaRota) {
        setForm({ ...FORM_INICIAL });
        setRgOriginal('');
        setSucesso(false);
        setErros({});
        return;
      }

      try {
        setCarregandoAluno(true);
        setSucesso(false);
        setErros({});

        const response = await alunosService.getAlunoRg(idDaRota);
        const aluno = response?.data ?? response;

        if (!aluno) {
          throw new Error('Aluno não encontrado.');
        }

        setForm({
          nome: normalizarTexto(aluno.nome),
          rg: normalizarTexto(aluno.rg_aluno || aluno.rg),
          telefone: maskTelefone(normalizarTexto(aluno.telefone)),
          cpf_responsavel: maskCPF(normalizarTexto(aluno.cpf_responsavel)),
          nome_responsavel: normalizarTexto(aluno.nome_responsavel),
          telefone_responsavel: maskTelefone(normalizarTexto(aluno.telefone_responsavel)),
          id_categoria: aluno.id_categoria,
          categoria: normalizarTexto(aluno.nome_categoria),
          data_nascimento: normalizarTexto(aluno.data_nascimento),
        });

        setRgOriginal(normalizarTexto(aluno.rg_aluno || aluno.rg || idDaRota));
      } catch (erro) {
        console.log('Erro ao carregar aluno para edição:', erro);
      } finally {
        setCarregandoAluno(false);
      }
    };

    carregarAluno();
  }, [idDaRota]);

  const carregarCategorias = async () => {
    try {
      const response = await categoriasService.listarCategorias();
      setCategorias(response.data);
    } catch (erro) {
      console.log('Erro ao carregar categorias:', erro);
    }
  };

  const setField = (campo, valor) => {
    setForm(prev => {
      const proximoForm = { ...prev, [campo]: valor };

      if (campo === 'cpf_responsavel' && !valor.replace(/\D/g, '')) {
        proximoForm.nome_responsavel = '';
        proximoForm.telefone_responsavel = '';
      }

      return proximoForm;
    });
    setErros(prev => ({ ...prev, [campo]: '' }));
  };

  const possuiCpf_responsavel = !!form.cpf_responsavel.trim();

  const validar = () => {
    const novosErros = {
      nome: validaObrigatorio(form.nome, 'Nome é obrigatório.'),
      rg: validaObrigatorio(form.rg, 'RG é obrigatório.'),
      telefone: validaTelefone(form.telefone),
      cpf_responsavel: form.cpf_responsavel ? validaCPF(form.cpf_responsavel) : '',
      nome_responsavel: '',
      telefone_responsavel:
        possuiCpf_responsavel && form.telefone_responsavel
          ? validaTelefone(form.telefone_responsavel)
          : '',
      categoria: validaObrigatorio(form.categoria, 'Selecione uma categoria.'),
      data_nascimento: validaData(form.data_nascimento),
    };

    setErros(novosErros);
    return !Object.values(novosErros).some(Boolean);
  };

  const handleCancelar = () => {
    setForm({ ...FORM_INICIAL });
    setErros({});
    setSucesso(false);
    setRgOriginal('');

    if (modoEdicao) {
      navigation.goBack();
    }
  };

  const onChangeCpfResponsavel = async (cpf) => {
    setField('cpf_responsavel', cpf);
    const cleanCPF = cpf.replace(/\.|-/g, '');

    if (cleanCPF.length === 11) {
      const response = await responsavelService.getResponsavelCPF(cleanCPF);
      console.log(response);

      if (response.status === 200) {
        setField('nome_responsavel', response.nome);
        setField('telefone_responsavel', maskTelefone(response.telefone));
      }
    }
  };

  const handleSalvar = async () => {
    if (!validar()) {
      return;
    }

    const response = modoEdicao
      ? await alunosService.atualizarAluno(rgOriginal || form.rg, form)
      : await alunosService.cadastrarAluno(form);

    console.log('Resposta salvar aluno:', response);
    if (response.status === 200 || response.status === 201) {
      navigation.goBack();
    }
  };

  const onChangeCategoria = (nomeCategoria) => {
    const categoria = categorias.find(c => c.nome_categoria === nomeCategoria);
    setField('categoria', nomeCategoria);
    setField('id_categoria', categoria?.id ?? null);
    setModalCategoria(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {carregandoAluno && modoEdicao ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, paddingTop: 0 }}
          keyboardVerticalOffset={120}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <View>
            <InputField
              label="Nome completo"
              obrigatorio
              placeholder="Ex: João da Silva"
              value={form.nome}
              onChangeText={v => setField('nome', v)}
              erro={erros.nome}
              autoCapitalize="words"
            />

            <InputField
              label="RG"
              obrigatorio
              placeholder="Ex: 81293030202"
              value={form.rg}
              onChangeText={v => setField('rg', v)}
              erro={erros.rg}
              mascara={maskApenasNumeros}
              keyboardType="numeric"
              disabled={modoEdicao}
            />

            <InputField
              label="Telefone"
              obrigatorio
              placeholder="(54) 98182-0000"
              value={form.telefone}
              onChangeText={v => setField('telefone', v)}
              erro={erros.telefone}
              mascara={maskTelefone}
              keyboardType="phone-pad"
            />

            <InputField
              label="Data de nascimento"
              obrigatorio
              placeholder="DD/MM/AAAA"
              value={form.data_nascimento}
              onChangeText={v => setField('data_nascimento', v)}
              erro={erros.data_nascimento}
              mascara={maskData}
              keyboardType="numeric"
            />

            <InputField
              label="CPF do responsável"
              placeholder="000.000.000-00"
              value={form.cpf_responsavel}
              onChangeText={v => onChangeCpfResponsavel(v)}
              erro={erros.cpf_responsavel}
              mascara={maskCPF}
              keyboardType="numeric"
            />

            {possuiCpf_responsavel && (
              <>
                <InputField
                  label="Nome do responsável"
                  placeholder="Ex: Maria da Silva"
                  value={form.nome_responsavel}
                  onChangeText={v => setField('nome_responsavel', v)}
                  erro={erros.nome_responsavel}
                  autoCapitalize="words"
                />

                <InputField
                  label="Telefone do responsável"
                  placeholder="(54) 98182-0000"
                  value={form.telefone_responsavel}
                  onChangeText={v => setField('telefone_responsavel', v)}
                  erro={erros.telefone_responsavel}
                  mascara={maskTelefone}
                  keyboardType="phone-pad"
                />
              </>
            )}

            <InputField
              label="Categoria"
              obrigatorio
              placeholder="Selecione uma categoria"
              value={form.categoria}
              onSelect={v => onChangeCategoria(v)}
              opcoes={categorias.map(c => c.nome_categoria)}
              erro={erros.categoria}
              variante="select"
            />

            {sucesso && (
              <View style={styles.sucessoBox}>
                <Text style={styles.sucessoTexto}>
                  {modoEdicao ? '✓ Aluno atualizado com sucesso!' : '✓ Aluno cadastrado com sucesso!'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.botaoSalvar}
              activeOpacity={0.85}
              onPress={handleSalvar}
              disabled={carregandoAluno}
            >
              <Text style={styles.botaoSalvarTexto}>{modoEdicao ? 'Salvar alterações' : 'Salvar'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
  },
  navTextoVoltar: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconeBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
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
    color: colors.primary,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
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
    color: colors.primary,
    fontWeight: '600',
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
    backgroundColor: colors.primary,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  modalItemAtivo: {
    backgroundColor: colors.primaryBorder,
  },
  modalItemTexto: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  modalItemTextoAtivo: {
    color: colors.primary,
    fontWeight: '700',
  },
  modalCheck: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  separador: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
});