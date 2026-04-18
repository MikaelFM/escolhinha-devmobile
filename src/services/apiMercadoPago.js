import axios from 'axios';
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { MercadoPagoConfig, PaymentMethods } from 'mercadopago';

const BASE_URL = 'http://192.168.0.102:5000/' //'https://api-projeto-mobile-1.onrender.com/';

let navigationRef = null;

export const setNavigationRef = (ref) => {
  navigationRef = ref;
};


const apiMercadoPago = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const testarAPIMercadoPago = async () => {
    const publicKey = 'TEST-b8ff20ae-66c1-43cd-af7e-f63074985e77';
    const AccessToken = 'TEST-222746670600055-041618-529914fe169936741dfd5a76e6054fff-1057157750';
    
    await loadMercadoPago();
    const mp = new window.MercadoPago(publicKey);

    const client = new MercadoPagoConfig({ accessToken: AccessToken });
    const paymentMethods = new PaymentMethods(client);

    paymentMethods.get().then((result) => console.log(result)).catch((error) => console.log(error));
};
