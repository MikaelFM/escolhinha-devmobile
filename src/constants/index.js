import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const API_CONFIG = {
  BASE_URL: 'http://192.168.0.106:5000/',
  TIMEOUT: 10000,
};

export const APP_VERSION = '1.0.4 (Beta)';

export const MERCADO_PAGO_CONFIG = {
  PUBLIC_KEY: 'TEST-b8ff20ae-66c1-43cd-af7e-f63074985e77',
  ACCESS_TOKEN: 'TEST-222746670600055-041618-529914fe169936741dfd5a76e6054fff-1057157750',
};

export const LAYOUT = {
  WINDOW_WIDTH: width,
  WINDOW_HEIGHT: height,
  IS_IOS: Platform.OS === 'ios',
  HEADER_HEIGHT: Platform.OS === 'ios' ? 90 : 70,
  TAB_BAR_HEIGHT: 60,
};