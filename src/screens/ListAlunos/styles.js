import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

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
    color: colors.primaryDark,
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
    backgroundColor: colors.background,
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    // shadowColor: colors.textPlaceholder,
    // shadowOpacity: 0.08,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 4 },
    // elevation: 1
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

export default styles;


