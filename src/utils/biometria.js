import * as LocalAuthentication from 'expo-local-authentication';

export const verificarSuporteBiometria = async () => {
  try {
    const temHardware = await LocalAuthentication.hasHardwareAsync();
    if (!temHardware) return false;
    const cadastrada = await LocalAuthentication.isEnrolledAsync();
    return cadastrada;
  } catch {
    return false;
  }
};

export const validarDisponibilidadeBiometriaComAlertas = async () => {
  try {
    const temHardware = await LocalAuthentication.hasHardwareAsync();
    if (!temHardware) {
      return {
        disponivel: false,
        title: 'Biometria indisponível',
        message: 'Este dispositivo não possui sensor biométrico.',
      };
    }

    const cadastrada = await LocalAuthentication.isEnrolledAsync();
    if (!cadastrada) {
      return {
        disponivel: false,
        title: 'Biometria não cadastrada',
        message: 'Nenhuma biometria está cadastrada neste dispositivo. Cadastre nas configurações do sistema.',
      };
    }

    return { disponivel: true };
  } catch {
    return {
      disponivel: false,
      title: 'Erro',
      message: 'Não foi possível verificar a disponibilidade de biometria.',
    };
  }
};
