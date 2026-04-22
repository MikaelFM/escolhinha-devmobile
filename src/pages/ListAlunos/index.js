import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  ActivityIndicator
} from 'react-native';

import { colors } from '../../global/colors';
import { useNavigation } from '@react-navigation/native';
import { alunosService } from '../../services';
import { categoriasService } from '../../services/categoriasService';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

const ITENS_POR_PAGINA = 5;
const TABS_STATUS = ['Todos', 'Em dia', 'Em atraso'];

const normalizarTexto = (valor) =>
  String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const extrairListaCategorias = (resposta) => {
  const lista = resposta?.data ?? resposta?.categorias ?? resposta?.items ?? resposta;
  return Array.isArray(lista) ? lista : [];
};

const extrairListaAlunos = (resposta) => {
  const lista = resposta?.alunos ?? resposta?.data?.alunos ?? [];
  return Array.isArray(lista) ? lista : [];
};

const extrairPaginacao = (resposta, pageSolicitada) => {
  const paginacao = resposta?.paginacao ?? resposta?.data?.paginacao ?? {};

  return {
    paginaAtual: paginacao.paginaAtual ?? pageSolicitada,
    itensPorPagina: paginacao.itensPorPagina ?? ITENS_POR_PAGINA,
    totalItens: paginacao.totalItens ?? 0,
    totalPaginas: paginacao.totalPaginas ?? 0,
    temMais: typeof paginacao.temMais === 'boolean' ? paginacao.temMais : null,
  };
};

export default function ListaAlunos() {
  const navigation = useNavigation();
  const [alunos, setAlunos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [buscaDebounced, setBuscaDebounced] = useState('');
  const [tabAtiva, setTabAtiva] = useState('Todos');
  const [paginacao, setPaginacao] = useState({
    paginaAtual: 0,
    itensPorPagina: ITENS_POR_PAGINA,
    totalItens: 0,
    totalPaginas: 0,
    temMais: true,
  });
  const requestIdRef = useRef(0);

  /**
   * Buscar categorias para montar os filtros de categoria
   */
  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBuscaDebounced(busca.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [busca]);

  const tabs = useMemo(() => {
    const categoriasDisponiveis = categorias
      .map(categoria => categoria?.nome_categoria)
      .filter(Boolean);

    return Array.from(new Set([...TABS_STATUS, ...categoriasDisponiveis]));
  }, [categorias]);

  const categoriaSelecionadaId = useMemo(() => {
    if (TABS_STATUS.includes(tabAtiva)) {
      return null;
    }

    const categoriaSelecionada = categorias.find(categoria => {
      return normalizarTexto(categoria?.nome_categoria) === normalizarTexto(tabAtiva);
    });

    return categoriaSelecionada?.id ?? categoriaSelecionada?.id_categoria ?? null;
  }, [categorias, tabAtiva]);

  const carregarCategorias = async () => {
    try {
      const resposta = await categoriasService.listarCategorias();
      setCategorias(extrairListaCategorias(resposta));
    } catch (error) {
      console.log('Erro ao carregar categorias:', error);
    }
  };

  const carregarAlunos = async ({ page = 1, append = false } = {}) => {
    const idConsulta = ++requestIdRef.current;

    try {
      if (page === 1) {
        setCarregandoInicial(true);
      } else {
        setCarregandoMais(true);
      }

      setErro(null);

      const params = {
        page,
        limit: ITENS_POR_PAGINA,
      };

      if (buscaDebounced) {
        params.nome = buscaDebounced;
      }

      if (tabAtiva === 'Em dia') {
        params.em_dia = true;
      } else if (tabAtiva === 'Em atraso') {
        params.em_dia = false;
      } else if (categoriaSelecionadaId) {
        params.id_categoria = categoriaSelecionadaId;
      }

      const resposta = await alunosService.listarAlunos(params);

      if (idConsulta !== requestIdRef.current) {
        return;
      }

      const novaLista = extrairListaAlunos(resposta);
      const novaPaginacao = extrairPaginacao(resposta, page);
      const totalItens = novaPaginacao.totalItens;
      const totalCarregado = append ? alunos.length + novaLista.length : novaLista.length;
      const temMais =
        typeof novaPaginacao.temMais === 'boolean'
          ? novaPaginacao.temMais
          : totalItens > 0
            ? totalCarregado < totalItens
            : novaLista.length === ITENS_POR_PAGINA;

      setAlunos(estadoAtual => (append ? [...estadoAtual, ...novaLista] : novaLista));
      setPaginacao({
        ...novaPaginacao,
        temMais,
      });
    } catch (error) {
      if (idConsulta !== requestIdRef.current) {
        return;
      }

      console.log('Erro ao carregar alunos:', error);
      setErro(error.message || 'Erro ao carregar alunos.');

      if (!append) {
        setAlunos([]);
        setPaginacao({
          paginaAtual: 0,
          itensPorPagina: ITENS_POR_PAGINA,
          totalItens: 0,
          totalPaginas: 0,
          temMais: true,
        });
      }
    } finally {
      if (idConsulta !== requestIdRef.current) {
        return;
      }

      setCarregandoInicial(false);
      setCarregandoMais(false);
    }
  };

  useEffect(() => {
    if (!TABS_STATUS.includes(tabAtiva) && !categoriaSelecionadaId && categorias.length === 0) {
      return;
    }

    if (!TABS_STATUS.includes(tabAtiva) && !categoriaSelecionadaId) {
      setAlunos([]);
      setPaginacao({
        paginaAtual: 0,
        itensPorPagina: ITENS_POR_PAGINA,
        totalItens: 0,
        totalPaginas: 0,
        temMais: true,
      });
      setCarregandoInicial(false);
      return;
    }

    carregarAlunos({ page: 1, append: false });
  }, [buscaDebounced, categoriaSelecionadaId, tabAtiva]);

  const handleCarregarMais = () => {
    if (carregandoInicial || carregandoMais) {
      return;
    }

    if (!paginacao.temMais) {
      return;
    }

    carregarAlunos({ page: paginacao.paginaAtual + 1, append: true });
  };

  const getCategoriaNome = (item) => {
    if (item?.nome_categoria) {
      return item.nome_categoria;
    }

    const categoria = categorias.find(valor => String(valor?.id ?? valor?.id_categoria) === String(item?.id_categoria));

    return categoria?.nome_categoria || 'Sem categoria';
  };

  const renderCardAluno = ({ item }) => {
    const nomeAluno = item?.nome || 'Aluno sem nome';
    const emDia = Number(item?.mensalidade ?? 0) === 0;
    const categoriaAluno = getCategoriaNome(item);
    const responsavel = item?.nome_responsavel;
    const frequencia = Number(item?.frequencia ?? 0);
    const faltas = Number(item?.faltas ?? 0);

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('fichaAluno', { rg: item?.rg_aluno || item?.rg })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{nomeAluno.substring(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.infoPrincipal}>
            <Text style={styles.nomeAluno}>{nomeAluno}</Text>
            <Text style={styles.categoriaTexto}>
              {categoriaAluno} â€¢ {responsavel || 'Sem responsÃ¡vel'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: emDia ? '#f0fdf4' : '#fef2f2' }]}>
            <Text style={[styles.statusTexto, { color: emDia ? '#16a34a' : '#dc2626' }]}>
               {emDia ? 'EM DIA' : 'ATRASO'}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
            <Text style={styles.statTexto}>{Math.round(frequencia)}% FrequÃªncia</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="alert-circle-outline" size={14} color="#94a3b8" />
            <Text style={styles.statTexto}>{faltas} Faltas</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#cbd5e1" style={{marginLeft: 'auto'}} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Alunos</Text>
        </View>
        <TouchableOpacity 
          style={styles.botaoAdicionar}
          onPress={() => navigation.navigate('cadastroAluno')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.buscaWrapper}>
        <Ionicons name="search-outline" size={20} color="#94a3b8" />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar por nome..."
          placeholderTextColor="#94a3b8"
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={18} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 55, marginTop: 15 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, tabAtiva === tab && styles.tabAtiva]}
              onPress={() => setTabAtiva(tab)}
            >
              <Text style={[styles.tabTexto, tabAtiva === tab && styles.tabTextoAtivo]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>
            {tabAtiva === 'Todos' ? 'Todos os alunos' : `Filtrando: ${tabAtiva}`}
          </Text>
          <Text style={styles.contadorAlunos}>{paginacao.totalItens} alunos</Text>
        </View>

        {erro ? (
          <View style={styles.erroContainer}>
            <Ionicons name="alert-circle" size={48} color="#dc2626" />
            <Text style={styles.erroTexto}>{erro}</Text>
            <TouchableOpacity
              style={styles.botaoTentar}
              onPress={() => carregarAlunos({ page: 1, append: false })}
            >
              <Text style={styles.botaoTentarTexto}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : carregandoInicial ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryMedium} />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        ) : (
          <FlatList
            data={alunos}
            keyExtractor={(item, index) => String(item?.rg_aluno || item?.rg || index) + '-' + index}
            renderItem={renderCardAluno}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
            onEndReached={handleCarregarMais}
            onEndReachedThreshold={0.25}
            ListFooterComponent={
              carregandoMais ? (
                <View style={styles.footerLoading}>
                  <ActivityIndicator size="small" color={colors.primaryMedium} />
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.vazio}>
                <Ionicons name="search-outline" size={48} color="#cbd5e1" />
                <Text style={styles.vazioTexto}>Nenhum aluno encontrado</Text>
                <Text style={styles.vazioSub}>Tente ajustar sua busca ou filtros.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

