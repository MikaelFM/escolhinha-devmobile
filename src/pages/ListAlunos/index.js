import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { colors } from '../../global/colors';
import { useNavigation } from '@react-navigation/native';
import { alunosService } from '../../services';
import { categoriasService } from '../../services/categoriasService';
import { Ionicons } from '@expo/vector-icons';

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
              {categoriaAluno} • {responsavel || 'Sem responsável'}
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
            <Text style={styles.statTexto}>{Math.round(frequencia)}% Frequência</Text>
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
    paddingBottom: 80
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
    backgroundColor: colors.background,
  },
  titulo: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: colors.primaryMedium,
    letterSpacing: -1
  },
  botaoAdicionar: {
    backgroundColor: colors.primaryMedium,
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  buscaWrapper: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 55, 
    borderWidth: 1, 
    borderColor: colors.primaryBorder,
  },
  buscaInput: { flex: 1, fontSize: 15, color: colors.primaryDark, marginLeft: 10 },
  tabsContainer: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  tab: {
    height: 38, 
    paddingHorizontal: 18, 
    borderRadius: 20,
    borderWidth: 1, 
    borderColor: colors.primaryBorder, 
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  tabAtiva: { 
    backgroundColor: colors.primaryMedium, 
    borderColor: colors.primaryMedium 
  },
  tabTexto: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: colors.textSecondary 
  },
  tabTextoAtivo: { 
    color: '#ffffff' 
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
    paddingTop: 8,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  secaoHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingTop: 25, 
    paddingBottom: 12,
  },
  secaoTitulo: { 
    fontSize: 11, 
    fontWeight: '900', 
    color: '#94a3b8', 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  contadorAlunos: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: colors.primaryMedium,
  },
  lista: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    backgroundColor: colors.primaryLight,
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarTexto: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: colors.primaryMedium 
  },
  infoPrincipal: { flex: 1, marginLeft: 12 },
  nomeAluno: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: colors.primaryDark
  },
  categoriaTexto: { 
    fontSize: 12, 
    color: colors.textSecondary, 
    marginTop: 2 
  },
  statusBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  statusTexto: { 
    fontSize: 9, 
    fontWeight: '900' 
  },
  cardFooter: { 
    flexDirection: 'row', 
    marginTop: 15, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9', 
    gap: 15, 
    alignItems: 'center' 
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statTexto: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  vazio: { alignItems: 'center', marginTop: 60, gap: 10 },
  vazioTexto: { fontSize: 17, fontWeight: '700', color: '#334155' },
  vazioSub: { fontSize: 14, color: '#94a3b8' },
  footerLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    gap: 15,
  },
  loadingText: {
    fontSize: 16,
    color: colors.primaryMedium,
    fontWeight: '600',
  },
  erroContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 20,
  },
  erroTexto: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
    textAlign: 'center',
  },
  botaoTentar: {
    backgroundColor: colors.primaryMedium,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  botaoTentarTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});