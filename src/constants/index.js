import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const API_CONFIG = {
  BASE_URL: 'https://api.seusistema.com.br/v1',
  TIMEOUT: 10000,
};

export const LAYOUT = {
  WINDOW_WIDTH: width,
  WINDOW_HEIGHT: height,
  IS_IOS: Platform.OS === 'ios',
  HEADER_HEIGHT: Platform.OS === 'ios' ? 90 : 70,
  TAB_BAR_HEIGHT: 60,
};