import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width } = Dimensions.get('window');

// Estilos padrão de cards reutilizáveis
export const cardStyles = StyleSheet.create({
  // Card de Resumo (para estatísticas/métricas)
  cardResumo: {
    width: (width / 2) - 28,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  // Container de ícone padrão
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  // Texto de label em cards
  cardLabel: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: colors.textPlaceholder, 
    textTransform: 'uppercase' 
  },
  
  // Texto de valor em cards
  cardValor: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: colors.primaryDark 
  },
  
  // Seção de título (ex: AÇÕES RÁPIDAS)
  secaoTitulo: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: colors.textSecondary, 
    letterSpacing: 1, 
    marginLeft: 20, 
    marginTop: 24 
  },
  
  // Painel com borda superior arredondada
  bottomSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 22,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  
  // Card de ação/botão
  btnAcao: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1
  },
  
  // Container para ícones em botões
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  // Texto em botão
  btnTexto: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: colors.primaryDark 
  },
  
  // Grid de cards de resumo
  gridStats: { 
    flexDirection: 'row', 
    paddingHorizontal: 20,
    paddingBottom: 8,
    justifyContent: 'space-between' 
  },
});
