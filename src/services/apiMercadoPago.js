import axios from 'axios';
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { MercadoPagoConfig, PaymentMethods } from 'mercadopago';
import { API_CONFIG, MERCADO_PAGO_CONFIG } from '../constants';

export const apiMercadoPago = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const testarAPIMercadoPago = async () => {
    await loadMercadoPago();

    const client = new MercadoPagoConfig({ accessToken: MERCADO_PAGO_CONFIG.ACCESS_TOKEN });
    const paymentMethods = new PaymentMethods(client);

    await paymentMethods.get();
};
