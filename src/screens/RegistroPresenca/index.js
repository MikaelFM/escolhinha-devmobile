import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../global/colors';
import InputField from '../../components/InputField';
import {
  formatarDataBR,
  converterDataBRParaDate,
  formatarIsoParaBr,
  formatarBrParaIsoCurta,
} from '../../utils/formatters';
import RegistroAlunoCard from '../../components/RegistroAlunoCard';
import { categoriasService } from '../../services/categoriasService';
import { presencaService } from '../../services/presencaService';
import styles from './styles';

const CRIAR_NOVA_DATA = 'Criar nova data';
const VERDE = '#16a34a';
const VERMELHO = '#dc2626';

const gerarChaveAlunoPresenca = (item, index) => {
  const id = item?.id ?? 'sem-id';
  const rg = item?.rg_aluno ?? 'sem-rg';
  const nome = item?.nome_aluno ?? 'sem-nome';
  return `${id}-${rg}-${nome}-${index}`;
};

export default function RegistroPresenca() {
  const dataAtual = formatarDataBR(new Date());
  const [dataSelecionada, setDataSelecionada] = useState(dataAtual);
  const [datasOpcoes, setDatasOpcoes] = useState([dataAtual]);
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [presencas, setPresencas] = useState({});
  const [presencasAntesEdicao, setPresencasAntesEdicao] = useState(null);
  const [pickerVisivel, setPickerVisivel] = useState(false);
  const [dataPicker, setDataPicker] = useState(new Date());

  const categoriaSelecionada = categorias.find((item) => item.nome === categoria);
  const idCategoriaSelecionada = categoriaSelecionada?.id;

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const resposta = await categoriasService.listarCategorias();
        const listaBruta = resposta?.data ?? resposta?.categorias ?? resposta?.items ?? resposta;
        const lista = Array.isArray(listaBruta)
          ? listaBruta
              .map((item) => {
                const nome = item?.nome_categoria ?? item?.nome ?? item?.categoria;
                const id = item?.id_categoria ?? item?.id ?? null;
                return nome ? { id, nome } : null;
              })
              .filter(Boolean)
          : [];

        if (lista.length > 0) {
          setCategorias(lista);
        }
      } catch (error) {
        console.log('Erro ao carregar categorias:', error);
      }
    };
    carregarCategorias();
  }, []);

  useEffect(() => {
    const carregarDatasLancadas = async () => {
      try {
        const resposta = await presencaService.listarDatasPresenca();
        const listaBruta = resposta?.datas ?? resposta?.data?.datas ?? resposta?.data ?? [];
        const datas = Array.isArray(listaBruta)
          ? listaBruta
              .map((item) => formatarIsoParaBr(item?.data_presenca ?? item?.data ?? item))
              .filter(Boolean)
          : [];

        const novasOpcoes = datas.includes(dataAtual) ? datas : [dataAtual, ...datas];
        setDatasOpcoes(novasOpcoes);
        setDataSelecionada(dataAtual);
      } catch (error) {
        console.log('Erro ao carregar datas lançadas:', error);
      }
    };
    carregarDatasLancadas();
  }, []);

  useEffect(() => {
    const carregarListaPresenca = async () => {
      const dataApi = formatarBrParaIsoCurta(dataSelecionada);
      if (!dataApi || !idCategoriaSelecionada) {
        setAlunos([]);
        setPresencas({});
        return;
      }
      try {
        const resposta = await presencaService.getListaPresenca(dataApi, idCategoriaSelecionada);
        const listaBruta = resposta?.data ?? [];
        const lista = Array.isArray(listaBruta) ? listaBruta : [];
        const alunosDaLista = lista.map((item, index) => ({
          id: gerarChaveAlunoPresenca(item, index),
          nome: item?.nome_aluno ?? 'Aluno',
          categoria: item?.nome_categoria ?? categoria,
          rg: item?.rg_aluno,
        }));
        const mapaPresencas = {};
        alunosDaLista.forEach((aluno, index) => {
          const item = lista[index];
          if (item?.presente !== null && item?.presente !== undefined) {
            mapaPresencas[aluno.id] = Number(item?.presente) === 1 || item?.presente === true;
          }
        });
        setAlunos(alunosDaLista);
        setPresencas(mapaPresencas);
      } catch (error) {
        setAlunos([]);
        setPresencas({});
      } finally {
        setIsEditMode(false);
        setPresencasAntesEdicao(null);
      }
    };
    carregarListaPresenca();
  }, [dataSelecionada, idCategoriaSelecionada]);

  const togglePresenca = (id) => {
    if (!isEditMode) return;
    setPresencas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const iniciarEdicaoPresenca = () => {
    if (!idCategoriaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma categoria antes de iniciar.');
      return;
    }
    setPresencasAntesEdicao({ ...presencas });
    setPresencas((prev) => {
      const proximo = { ...prev };
      alunos.forEach((aluno) => {
        if (!Object.prototype.hasOwnProperty.call(proximo, aluno.id)) {
          proximo[aluno.id] = true;
        }
      });
      return proximo;
    });
    setIsEditMode(true);
  };

  const handleCancelarEdicao = () => {
    setPresencas(presencasAntesEdicao ?? {});
    setPresencasAntesEdicao(null);
    setIsEditMode(false);
  };

  const handleSalvar = () => {
    if (isSaving) return;
    const dataApi = formatarBrParaIsoCurta(dataSelecionada);
    if (!dataApi || !idCategoriaSelecionada) {
      Alert.alert('Atenção', 'Data e categoria são obrigatórios.');
      return;
    }
    const alunosPayload = alunos
      .filter((aluno) => !!aluno?.rg)
      .map((aluno) => ({
        rg_aluno: String(aluno.rg),
        presente: !!presencas[aluno.id],
      }));
    if (alunosPayload.length === 0) {
      Alert.alert('Atenção', 'Nenhum aluno encontrado para salvar.');
      return;
    }
    setIsSaving(true);
    presencaService.inserirPresenca({
      presenca: { data_presenca: dataApi, id_categoria: idCategoriaSelecionada, alunos: alunosPayload }
    })
    .then(async () => {
      Alert.alert('Sucesso', 'Chamada salva com sucesso!');
      setIsEditMode(false);
    })
    .catch((error) => {
      Alert.alert('Erro', error?.message || 'Erro ao salvar.');
    })
    .finally(() => setIsSaving(false));
  };

  const abrirCriacaoDeData = () => {
    setDataPicker(converterDataBRParaDate(dataSelecionada));
    setPickerVisivel(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.titulo}>Chamada</Text>
          <View style={[styles.badge, isEditMode ? styles.badgeEdicao : styles.badgeLeitura]}>
            <Text style={styles.badgeTexto}>{isEditMode ? 'EDIÇÃO' : 'VISUALIZAÇÃO'}</Text>
          </View>
        </View>
        <Text style={styles.subtitulo}>Selecione a data e categoria para filtrar.</Text>
      </View>

      <View style={styles.filtros}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <InputField
            label="Data da Aula"
            variante="select"
            opcoes={[CRIAR_NOVA_DATA, ...datasOpcoes]}
            value={dataSelecionada}
            disabled={isEditMode}
            onSelect={(opcao) => opcao === CRIAR_NOVA_DATA ? abrirCriacaoDeData() : setDataSelecionada(opcao)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <InputField
            label="Categoria"
            placeholder="Selecione"
            variante="select"
            opcoes={categorias.map((item) => item.nome)}
            value={categoria}
            disabled={isEditMode}
            onSelect={setCategoria}
          />
        </View>
      </View>

      <FlatList
        data={alunos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const statusConhecido = Object.prototype.hasOwnProperty.call(presencas, item.id);
          const isPresente = presencas[item.id] === true;

          return (
            <RegistroAlunoCard
              styles={styles}
              item={item}
              isEditMode={isEditMode}
              isPresente={isPresente}
              statusConhecido={statusConhecido}
              onToggle={() => togglePresenca(item.id)}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>}
      />

      <View style={styles.footer}>
        {isEditMode ? (
          <View style={styles.footerAcoes}>
            <TouchableOpacity style={[styles.botaoFooter, styles.botaoCancelar]} onPress={handleCancelarEdicao} disabled={isSaving}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botaoFooter, styles.botaoSalvar, isSaving && styles.botaoSalvarDesabilitado]} onPress={handleSalvar} disabled={isSaving}>
              <Text style={styles.botaoSalvarTexto}>{isSaving ? 'Salvando...' : 'Salvar Chamada'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.botaoEditarPrincipal} onPress={iniciarEdicaoPresenca} disabled={isSaving}>
            <Text style={styles.botaoSalvarTexto}>{Object.keys(presencas).length === 0 ? 'Iniciar Chamada' : 'Editar Chamada'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={pickerVisivel} transparent animationType="fade">
        <DateTimePicker
          value={dataPicker}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={(_, selectedDate) => {
            if (selectedDate) {
              const novaData = formatarDataBR(selectedDate);
              setDataSelecionada(novaData);
              setDatasOpcoes(prev => prev.includes(novaData) ? prev : [novaData, ...prev]);
              setPickerVisivel(false);
            }
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}




