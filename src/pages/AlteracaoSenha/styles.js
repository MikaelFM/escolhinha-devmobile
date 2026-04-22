import { StyleSheet } from "react-native";
import { colors } from "../../global/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navBar: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 50,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 34,
  },
  iconeTexto: {
    fontSize: 28,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primaryDark,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "400",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  requisitosCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
  },
  requisitosTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
  },
  requisito: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  requisitoTexto: {
    fontSize: 12,
    fontWeight: "500",
  },
  sucessoBox: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  sucessoTexto: {
    color: "#16a34a",
    fontSize: 14,
    fontWeight: "600",
  },
  botaoSalvar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  botaoSalvarTexto: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default styles;
