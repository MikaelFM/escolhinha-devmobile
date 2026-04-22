import { StyleSheet } from 'react-native';
import { colors } from '../../global/colors';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';
const AZUL_CLARO = '#e0f2fe';
const LARANJA = '#f59e0b';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  buscaWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    marginHorizontal: 20, 
    marginTop: 20, 
    paddingHorizontal: 15, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    height: 55 
  },
  buscaInput: { flex: 1, fontSize: 15, color: '#1e293b', marginLeft: 10 },

  selectContainer: { paddingHorizontal: 20, marginTop: 15 },
  selectTrigger: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTriggerTexto: { fontSize: 14, fontWeight: '700', color: '#334155' },
  selectLista: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  selectItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectItemAtivo: { backgroundColor: '#eff6ff' },
  selectItemTexto: { fontSize: 14, color: '#475569', fontWeight: '600' },
  selectItemTextoAtivo: { color: colors.primary, fontWeight: '800' },

  secaoHeader: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 12 },
  secaoTitulo: { fontSize: 11, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },

  listaContainer: { paddingHorizontal: 20 },
  estadoContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  estadoTexto: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#475569', textAlign: 'center' },
  cardAluno: { 
    backgroundColor: '#ffffff', 
    marginBottom: 10, 
    padding: 18, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  nomeAluno: { fontSize: 16, fontWeight: '800', color: colors.primary, marginTop: 8 },
  rgAluno: { fontSize: 11, color: '#94a3b8', fontWeight: '700', marginTop: 2 },
  infoFinanceira: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  valorTexto: { fontSize: 13, fontWeight: '700', color: '#475569' },
  dataTexto: { fontSize: 11, fontWeight: '600', color: VERDE },
  mesRefTexto: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginTop: 4 },

  statusPilula: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, alignSelf: 'flex-start' },
  statusVerde: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  statusVermelho: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  statusTexto: { fontSize: 8, fontWeight: '900' },
  statusTextoVerde: { color: VERDE },
  statusTextoVermelho: { color: VERMELHO },

  switchWrapper: { alignItems: 'center', marginLeft: 15 },
  labelSwitch: { fontSize: 8, fontWeight: '900', color: '#94a3b8', marginBottom: 4 }
});

export default styles;


