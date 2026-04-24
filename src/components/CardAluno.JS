import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/colors';

const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

const CardAluno = ({ aluno }) => {
  const navigation = useNavigation();
  const emDia = aluno.mensalidadeEmDia;
  const frequenciaBaixa = aluno.frequencia < 85;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('fichaAluno', { aluno: aluno })}
    >
      <View style={styles.containerPrincipal}>
        <Image
          source={{ uri: aluno.fotoUrl || DEFAULT_AVATAR }}
          style={styles.fotoAluno}
        />

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <View style={styles.categoriaBadge}>
              <Text style={styles.categoriaTexto}>{aluno.categoria.toUpperCase()}</Text>
            </View>

            <View style={[styles.statusPilula, emDia ? styles.statusVerde : styles.statusVermelho]}>
              <Text style={[styles.statusTexto, emDia ? styles.statusTextoVerde : styles.statusTextoVermelho]}>
                {emDia ? 'PAGO' : 'PENDENTE'}
              </Text>
            </View>
          </View>

          <Text style={styles.cardNome} numberOfLines={1}>{aluno.nome}</Text>

          <View style={styles.dadosGerais}>
            <Text style={styles.subtextoCompacto}>Resp: {aluno.responsavel}</Text>
            <Text style={styles.subtextoCompacto}>Nasc: {aluno.dataNascimento}</Text>
          </View>

          <View style={styles.indicadoresRow}>
            <View style={styles.indicador}>
              <Text style={styles.indicadorLabel}>FREQUÊNCIA</Text>
              <Text style={[styles.indicadorValor, frequenciaBaixa && { color: colors.warning }]}>
                {aluno.frequencia}%
              </Text>
            </View>
            <View style={styles.indicador}>
              <Text style={styles.indicadorLabel}>FALTAS (MÊS)</Text>
              <Text style={[styles.indicadorValor, aluno.faltas > 3 && { color: colors.error }]}>
                {aluno.faltas}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 16,
    borderColor: colors.borderMedium,
    borderWidth: 1,
    marginBottom: 12,
  },
  containerPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fotoAluno: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaBadge: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoriaTexto: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  statusPilula: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusVerde: { backgroundColor: colors.successLight },
  statusVermelho: { backgroundColor: colors.errorLight },
  statusTexto: { fontSize: 11, fontWeight: '700' },
  statusTextoVerde: { color: colors.success },
  statusTextoVermelho: { color: colors.error },
  cardNome: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  dadosGerais: {
    marginBottom: 8,
  },
  subtextoCompacto: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  indicadoresRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  indicador: {
    alignItems: 'flex-start',
  },
  indicadorLabel: {
    fontSize: 9,
    color: colors.textPlaceholder,
    fontWeight: '700',
    marginBottom: 1,
  },
  indicadorValor: {
    fontSize: 13,
    color: colors.textStrong,
    fontWeight: '700',
  },
});

export default CardAluno;
