import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../global/colors';
import { useNavigation } from '@react-navigation/native';

const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

const VERDE = '#16a34a';
const VERMELHO = '#dc2626';
const LARANJA = '#ea580c';

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
              <Text style={[styles.indicadorValor, frequenciaBaixa && { color: LARANJA }]}>
                {aluno.frequencia}%
              </Text>
            </View>
            <View style={styles.indicador}>
              <Text style={styles.indicadorLabel}>FALTAS (MÊS)</Text>
              <Text style={[styles.indicadorValor, aluno.faltas > 3 && { color: VERMELHO }]}>
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    borderColor: '#e2e8f0',
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
    borderColor: '#e2e8f0',
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
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoriaTexto: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  statusPilula: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusVerde: { backgroundColor: '#dcfce7' },
  statusVermelho: { backgroundColor: '#fee2e2' },
  statusTexto: { fontSize: 11, fontWeight: '700' },
  statusTextoVerde: { color: VERDE },
  statusTextoVermelho: { color: VERMELHO },
  cardNome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  dadosGerais: {
    marginBottom: 8,
  },
  subtextoCompacto: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  indicadoresRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  indicador: {
    alignItems: 'flex-start',
  },
  indicadorLabel: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '700',
    marginBottom: 1,
  },
  indicadorValor: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '700',
  },
});

export default CardAluno;