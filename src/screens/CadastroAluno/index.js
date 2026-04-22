import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { maskApenasNumeros, maskCPF, maskData, maskTelefone } from '../../utils/masks';
import { validaCPF, validaData, validaObrigatorio, validaTelefone } from '../../utils/validators';
import InputField from '../../components/InputField';
import { colors } from '../../constants/colors';
import { alunosService } from '../../services';
import { categoriasService } from '../../services/categoriasService';
import { responsavelService } from '../../services/responsavelService';
import { normalizarTexto } from '../../utils/formatters';
import styles from './styles';

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
          throw new Error('Aluno nÃ£o encontrado.');
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
        console.log('Erro ao carregar aluno para ediÃ§Ã£o:', erro);
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
      nome: validaObrigatorio(form.nome, 'Nome Ã© obrigatÃ³rio.'),
      rg: validaObrigatorio(form.rg, 'RG Ã© obrigatÃ³rio.'),
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
          <View style={styles.topHeader}>
            <Text style={styles.titulo}>{modoEdicao ? 'Editar Aluno' : 'Cadastrar Aluno'}</Text>
            <Text style={styles.subtitulo}>
              {modoEdicao ? 'Atualize os dados do aluno.' : 'Cadastre um novo aluno.'}
            </Text>
          </View>

          <View>
            <InputField
              label="Nome completo"
              obrigatorio
              placeholder="Ex: JoÃ£o da Silva"
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
              label="CPF do responsÃ¡vel"
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
                  label="Nome do responsÃ¡vel"
                  placeholder="Ex: Maria da Silva"
                  value={form.nome_responsavel}
                  onChangeText={v => setField('nome_responsavel', v)}
                  erro={erros.nome_responsavel}
                  autoCapitalize="words"
                />

                <InputField
                  label="Telefone do responsÃ¡vel"
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
                  {modoEdicao ? 'âœ“ Aluno atualizado com sucesso!' : 'âœ“ Aluno cadastrado com sucesso!'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.botaoSalvar}
              activeOpacity={0.85}
              onPress={handleSalvar}
              disabled={carregandoAluno}
            >
              <Text style={styles.botaoSalvarTexto}>{modoEdicao ? 'Salvar alteraÃ§Ãµes' : 'Salvar'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}


