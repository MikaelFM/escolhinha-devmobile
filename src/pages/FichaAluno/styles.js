import { StyleSheet } from "react-native";
import { colors } from "../../global/colors";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    textAlign: "center",
  },
  btnRetry: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnRetryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  perfilCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 20,
  },
  avatarIniciais: {
    width: 70,
    height: 70,
    borderRadius: 25,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 15,
  },
  avatarIniciaisTexto: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
  },
  nomeAluno: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  badgeCategoria: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  badgeCategoriaTexto: { fontSize: 10, fontWeight: "900", color: "#ffffff" },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  labelSecao: {
    fontSize: 11,
    fontWeight: "900",
    color: "#94a3b8",
    letterSpacing: 1,
  },

  infoGrid: { flexDirection: "row", gap: 15, marginTop: 15 },
  infoBox: { flex: 1 },
  infoBoxFull: { width: "100%", marginTop: 15 },
  infoLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94a3b8",
    marginBottom: 4,
  },
  infoTexto: { fontSize: 15, fontWeight: "700", color: colors.primaryDark },

  secaoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsBadgeRow: { flexDirection: "row", gap: 10 },
  miniStat: { fontSize: 11, fontWeight: "800", color: "#64748b" },

  aulaItem: { alignItems: "center", marginRight: 15, marginTop: 10 },
  aulaCirculo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  aulaCirculoFalta: { backgroundColor: "#fef2f2", borderColor: "#fca5a5" },
  aulaStatusTexto: { fontSize: 16, fontWeight: "900", color: VERDE },
  aulaStatusTextoFalta: { color: VERMELHO },
  aulaDataTexto: { fontSize: 10, fontWeight: "700", color: "#94a3b8" },
  vazioTexto: {
    marginTop: 12,
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
  },

  pagamentoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  borderTop: { borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  pagamentoMes: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  pagamentoValor: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 6,
  },
  pixInfo: { fontSize: 11, fontWeight: "700", color: "#0f766e", marginTop: 6 },
  loadingSwitchContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPilula: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  statusVerde: { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" },
  statusVermelho: { backgroundColor: "#fef2f2", borderColor: "#fca5a5" },
  statusTexto: { fontSize: 8, fontWeight: "900" },
  statusTextoVerde: { color: VERDE },
  statusTextoVermelho: { color: VERMELHO },

  btnVerMais: { marginTop: 15, alignItems: "center" },
  btnVerMaisTexto: { fontSize: 12, fontWeight: "800", color: colors.primary },

  footerAcoes: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 10,
    gap: 12,
  },
  btnEditar: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnEditarTexto: { fontSize: 15, fontWeight: "800", color: "#ffffff" },
  btnExcluir: {
    width: 60,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
});

export default styles;
