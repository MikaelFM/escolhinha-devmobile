import { StyleSheet } from "react-native";
import { colors } from "../../global/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    marginTop: 70,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  welcomeContainer: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: colors.primaryMedium,
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 18,
    shadowColor: "black",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 40 },
    elevation: 8,
  },
  saudacao: { fontSize: 26, fontWeight: "800", color: colors.primaryDark },
  subSaudacao: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  cardTitulo: { fontSize: 20, fontWeight: "800", color: colors.textInverted },
  cardMensagem: {
    fontSize: 14,
    color: colors.primaryBorder,
    marginTop: 6,
    lineHeight: 20,
  },

  gridStats: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  cardResumo: {
    width: width / 2 - 28,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textPlaceholder,
    textTransform: "uppercase",
  },
  cardValor: { fontSize: 20, fontWeight: "800", color: colors.primaryDark },

  secaoTitulo: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 1,
    marginLeft: 20,
    marginTop: 24,
  },

  bottomSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 10,
    paddingTop: 10,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },

  gridAcoes: {
    flexDirection: "column",
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: "transparent",
  },
  btnAcao: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  iconWrapperAtalho: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  btnAcaoConteudo: { flex: 1, marginLeft: 4 },
  btnAcaoUltimo: {
    borderBottomWidth: 0,
  },
  btnAcaoTexto: { fontSize: 15, fontWeight: "700", color: colors.primaryDark },
});

export default styles;
