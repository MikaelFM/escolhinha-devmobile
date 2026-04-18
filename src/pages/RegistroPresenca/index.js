import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../global/colors';
import InputField from '../../components/InputField';
import { categoriasService } from '../../services/categoriasService';
import { presencaService } from '../../services/presencaService';


const CRIAR_NOVA_DATA = 'Criar nova data';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';

const formatarDataBR = (data) => {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const converterDataBRParaDate = (texto) => {
  const [dia, mes, ano] = String(texto || '').split('/').map(Number);

  if (!dia || !mes || !ano) {
    return new Date();
  }

  return new Date(ano, mes - 1, dia);
};

const normalizarDataApiParaBR = (valor) => {
  if (!valor) return '';

  const texto = String(valor).trim();

  const isoMatch = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  const data = new Date(texto);
  if (!Number.isNaN(data.getTime())) {
    return formatarDataBR(data);
  }

  return texto;
};

const gerarChaveAlunoPresenca = (item, index) => {
  const id = item?.id ?? 'sem-id';
  const rg = item?.rg_aluno ?? 'sem-rg';
  const nome = item?.nome_aluno ?? 'sem-nome';

  return `${id}-${rg}-${nome}-${index}`;
};

export default function RegistroPresenca() {
  const [dataSelecionada, setDataSelecionada] = useState('18/03/2026');
  const [datasOpcoes, setDatasOpcoes] = useState([]);
  const [categoria, setCategoria] = useState('Sub-11');
  const [categorias, setCategorias] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [presencas, setPresencas] = useState({});
  const [presencasAntesEdicao, setPresencasAntesEdicao] = useState(null);
  const [pickerVisivel, setPickerVisivel] = useState(false);
  const [dataPicker, setDataPicker] = useState(converterDataBRParaDate('18/03/2026'));

  const converterDataBRParaApi = (texto) => {
    const [dia, mes, ano] = String(texto || '').split('/');

    if (!dia || !mes || !ano) {
      return '';
    }

    return `${ano}-${mes}-${dia}`;
  };

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
                if (typeof item === 'string') {
                  return { id: null, nome: item };
                }

                const nome = item?.nome_categoria ?? item?.nome ?? item?.categoria;
                const id = item?.id_categoria ?? item?.id ?? null;

                if (!nome) return null;

                return { id, nome };
              })
              .filter(Boolean)
          : [];

        if (lista.length > 0) {
          setCategorias(lista);

          const nomesCategorias = lista.map((item) => item.nome);

          if (!nomesCategorias.includes(categoria)) {
            setCategoria(lista[0].nome);
          }
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
              .map((item) => normalizarDataApiParaBR(item?.data_presenca ?? item?.data ?? item))
              .filter(Boolean)
          : [];

        if (datas.length > 0) {
          setDatasOpcoes(datas);

          if (!datas.includes(dataSelecionada)) {
            setDataSelecionada(datas[0]);
            setDataPicker(converterDataBRParaDate(datas[0]));
          }
        }
      } catch (error) {
        console.log('Erro ao carregar datas lançadas:', error);
      }
    };

    carregarDatasLancadas();
  }, []);

  useEffect(() => {
    const carregarListaPresenca = async () => {
      const dataApi = converterDataBRParaApi(dataSelecionada);

      if (!dataApi || !idCategoriaSelecionada) {
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

          if (item?.presente === null || item?.presente === undefined) {
            return;
          }

          mapaPresencas[aluno.id] = Number(item?.presente) === 1 || item?.presente === true;
        });

        setAlunos(alunosDaLista);
        setPresencas(mapaPresencas);
      } catch (error) {
        console.log('Erro ao carregar lista de presença:', error);
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
    setPresencas(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const iniciarEdicaoPresenca = () => {
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
    if (isSaving) {
      return;
    }

    console.log(alunos);

    const dataApi = converterDataBRParaApi(dataSelecionada);

    if (!dataApi) {
      Alert.alert('Atenção', 'Selecione uma data válida para salvar.');
      return;
    }

    if (!idCategoriaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma categoria válida para salvar.');
      return;
    }

    const alunosPayload = alunos
      .filter((aluno) => !!aluno?.rg)
      .map((aluno) => ({
        rg_aluno: String(aluno.rg),
        presente: !!presencas[aluno.id],
      }));

    if (alunosPayload.length === 0) {
      Alert.alert('Atenção', 'Nenhum aluno disponível para salvar nesta data/categoria.');
      return;
    }

    const payload = {
      presenca: {
        data_presenca: dataApi,
        id_categoria: idCategoriaSelecionada,
        alunos: alunosPayload,
      },
    };

    setIsSaving(true);

    presencaService.inserirPresenca(payload)
      .then(async () => {
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

            if (item?.presente === null || item?.presente === undefined) {
              return;
            }

            mapaPresencas[aluno.id] = Number(item?.presente) === 1 || item?.presente === true;
          });

          setAlunos(alunosDaLista);
          setPresencas(mapaPresencas);
        } catch (error) {
          console.log('Erro ao atualizar lista após salvar presença:', error);
        }

        Alert.alert('Sucesso', 'Chamada salva com sucesso!');
        setPresencasAntesEdicao(null);
        setIsEditMode(false);
      })
      .catch((error) => {
        console.log('Erro ao salvar presença:', error);
        Alert.alert('Erro', error?.message || 'Não foi possível salvar a chamada.');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const abrirCriacaoDeData = () => {
    setDataPicker(converterDataBRParaDate(dataSelecionada));
    setPickerVisivel(true);
  };

  const confirmarNovaData = () => {
    const novaData = formatarDataBR(dataPicker);

    setDataSelecionada(novaData);
    setDatasOpcoes(prev => {
      if (prev.includes(novaData)) {
        return prev;
      }

      return [novaData, ...prev];
    });
    setPickerVisivel(false);
  };

  const renderAluno = ({ item }) => {
    const statusConhecido = presencas.hasOwnProperty(item.id);
    const isPresente = presencas[item.id] === true;

    return (
      <TouchableOpacity 
        style={[
            styles.cardAluno, 
            !statusConhecido ? styles.cardSemRegistro : (isPresente ? styles.cardPresente : styles.cardAusente)
        ]} 
        onPress={() => togglePresenca(item.id)}
        activeOpacity={isEditMode ? 0.7 : 1}
        disabled={!isEditMode}
      >
        <View style={{ flex: 1 }}>
          <View style={[
            styles.statusLinhaColorida, 
            !statusConhecido ? styles.statusCinza : (isPresente ? styles.statusVerde : styles.statusVermelho)
          ]} />

          <Text style={[styles.nomeAluno, !isPresente && statusConhecido && { color: '#991b1b' }]}>
            {item.nome}
          </Text>
          
          <Text style={styles.subtituloAluno}>
            {!statusConhecido ? 'Sem registro' : (isPresente ? 'Presente' : 'Faltou')}
          </Text>
        </View>
        
        {isEditMode && (
          <View style={[
              styles.checkbox, 
              isPresente ? styles.checkboxChecked : styles.checkboxUnchecked
          ]}>
            <Text style={styles.checkText}>{isPresente ? '✓' : '✕'}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
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
        <Text style={styles.subtitulo}>
            {Object.keys(presencas).length === 0 
                ? 'Nenhuma chamada realizada para esta data.' 
                : 'Selecione a data e categoria para filtrar.'}
        </Text>
      </View>

      <View style={styles.filtros}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <InputField 
            label="Data da Aula" 
            variante="select" 
            opcoes={[CRIAR_NOVA_DATA, ...datasOpcoes]} 
            value={dataSelecionada} 
            disabled={isEditMode}
            onSelect={(opcao) => {
              if (opcao === CRIAR_NOVA_DATA) {
                abrirCriacaoDeData();
                return;
              }

              setDataSelecionada(opcao);
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <InputField 
            label="Categoria" 
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
        renderItem={renderAluno}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
            <TouchableOpacity 
                style={styles.botaoEditarPrincipal} 
                onPress={iniciarEdicaoPresenca}
                disabled={isSaving}
            >
                <Text style={styles.botaoSalvarTexto}>
                    {Object.keys(presencas).length === 0 ? 'Iniciar Chamada' : 'Editar Chamada'}
                </Text>
            </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={pickerVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisivel(false)}
      >
        <DateTimePicker
                value={dataPicker}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    setDataPicker(selectedDate);

                    const novaData = formatarDataBR(selectedDate);
                    setDataSelecionada(novaData);
                    setDatasOpcoes(prev => {
                      if (prev.includes(novaData)) {
                        return prev;
                      }

                      return [novaData, ...prev];
                    });
                    setPickerVisivel(false);
                  }
                }}
              />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingTop: 80, paddingBottom: 100 },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  titulo: { fontSize: 24, fontWeight: '800', color: colors.azul },
  subtitulo: { fontSize: 13, color: '#64748b' },
  filtros: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeEdicao: { backgroundColor: '#fef3c7' },
  badgeLeitura: { backgroundColor: '#f1f5f9' },
  badgeTexto: { fontSize: 10, fontWeight: '800', color: '#92400e' },

  cardAluno: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardPresente: { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' },
  cardAusente: { borderColor: '#fecaca', backgroundColor: '#fef2f2' },
  cardSemRegistro: { borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  
  nomeAluno: { fontSize: 16, fontWeight: '700', color: colors.azul },
  subtituloAluno: { fontSize: 12, color: '#64748b', marginTop: 2 },
  
  statusLinhaColorida: { width: 30, height: 4, borderRadius: 2, marginBottom: 8 },
  statusVerde: { backgroundColor: VERDE },
  statusVermelho: { backgroundColor: VERMELHO },
  statusCinza: { backgroundColor: '#cbd5e1' },

  checkbox: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: VERDE },
  checkboxUnchecked: { backgroundColor: VERMELHO },
  checkText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  footer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerAcoes: { flexDirection: 'row', gap: 12 },
  botaoFooter: { flex: 1, borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  botaoEditarPrincipal: { backgroundColor: colors.azul, borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  botaoSalvar: { backgroundColor: colors.azul },
  botaoSalvarDesabilitado: { opacity: 0.6 },
  botaoSalvarTexto: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  botaoCancelar: { backgroundColor: '#f1f5f9' },
  botaoCancelarTexto: { color: '#64748b', fontSize: 15, fontWeight: '800' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#94a3b8' }
  ,
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.azul,
    marginBottom: 12,
  },
  pickerWrapper: {
    alignItems: 'center',
    marginBottom: 14,
  },
  modalAcoes: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBotao: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBotaoCancelar: {
    backgroundColor: '#f1f5f9',
  },
  modalBotaoConfirmar: {
    backgroundColor: colors.azul,
  },
  modalBotaoCancelarTexto: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '800',
  },
  modalBotaoConfirmarTexto: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});