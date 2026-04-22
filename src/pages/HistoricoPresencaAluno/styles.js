import { StyleSheet } from "react-native";
import { colors } from "../../global/colors";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: colors.textPlaceholder,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  header: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 20 },
  titulo: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.5,
  },
  subtitulo: { fontSize: 14, color: colors.textPlaceholder, marginTop: 4 },

  resumoCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 25,
  },
  resumoItem: { flex: 1, alignItems: "center" },
  resumoLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: colors.textPlaceholder,
    letterSpacing: 1,
    marginBottom: 5,
  },
  resumoValor: { fontSize: 18, fontWeight: "800", color: colors.primary },
  divisor: { width: 1, backgroundColor: "#e2e8f0", height: "100%" },

  secaoTitulo: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.textPlaceholder,
    marginLeft: 20,
    marginBottom: 15,
    letterSpacing: 1,
  },

  listaContainer: { marginHorizontal: 20 },
  cardPresenca: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  cardFalta: {
    backgroundColor: "#fff8f8",
    borderRadius: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dataTitulo: { fontSize: 16, fontWeight: "700", color: colors.primary },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusTexto: { fontSize: 10, fontWeight: "900" },

  loadingContainer: {
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  errorContainer: {
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    marginTop: 10,
    color: VERMELHO,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  vazioTexto: {
    color: colors.textPlaceholder,
    fontSize: 13,
    fontWeight: "600",
    paddingVertical: 12,
  },

  infoFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 30,
    marginTop: 30,
    gap: 8,
    opacity: 0.7,
  },
  infoFooterTexto: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});

export default styles;
