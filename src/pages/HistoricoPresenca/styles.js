import { StyleSheet } from "react-native";
import { colors } from "../../global/colors";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  mesSelector: { flexDirection: "row", alignItems: "center", gap: 15 },
  headerTitulo: { fontSize: 17, fontWeight: "800", color: colors.primary },

  resumoContainer: { flexDirection: "row", padding: 20, gap: 12 },
  resumoCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  resumoLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94a3b8",
    marginBottom: 4,
  },
  resumoValor: { fontSize: 16, fontWeight: "800" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 45,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  input: { flex: 1, marginLeft: 10, fontWeight: "600", color: colors.primary },

  secaoTitulo: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    marginLeft: 20,
    marginBottom: 10,
    letterSpacing: 1,
  },

  cardAluno: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoPrincipal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  nomeAluno: { fontSize: 15, fontWeight: "800", color: colors.primary },
  subTexto: { fontSize: 12, color: "#64748b", fontWeight: "600", marginTop: 2 },

  badgeAlerta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  alertaTexto: {
    color: VERMELHO,
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 4,
  },

  miniChamadaContainer: { flexDirection: "row", gap: 6 },
  pontoStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  pontoPago: { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" },
  pontoPendente: { backgroundColor: "#fef2f2", borderColor: "#fca5a5" },
  pontoTexto: { fontSize: 10, fontWeight: "800", color: "#64748b" },
});

export default styles;
