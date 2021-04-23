import getLogger from '../../../utils/logger';
import { Request, Response } from 'express';
import * as expressModule from 'express';
import fetch, { FetchError, RequestInit, Response as FetchResponse } from 'node-fetch';

const {
  // @ts-ignore
  default: { Router },
} = expressModule;
const router = Router();
const logger = getLogger(module.filename);

logger.log('api-orders....');

enum PAYMENT_URL {
  VPS = 'http://pev-demo.store:3001/dev-proxy',
  PAY_U = 'https://secure.snd.payu.com/api/v2_1/orders',
}

router.options('/api/orders', (req: Request, res: Response) => {
  logger.log('OPTIONS /api/orders:', req.headers);

  res.setHeader('Access-Control-Allow-Headers', 'authorization,content,content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  res.send();
});

router.post('/api/orders', (req: Request, res: Response) => {
  logger.log('POST /api/orders env:', process.env.NODE_ENV);

  const url = process.env.NODE_ENV === 'development' ? PAYMENT_URL.VPS : PAYMENT_URL.PAY_U;
  const requestOptions = {
    method: 'POST',
    redirect: 'manual',
    headers: getHeaders(),
    body: JSON.stringify(getBody()),
  };

  fetch(url, requestOptions as RequestInit).then(
    async (response: FetchResponse) => {
      const resValue = await response.text();
      logger.log('PayU response:', resValue);

      res.send(resValue);
    },
    (error: FetchError) => {
      logger.error('PayU error:', error);

      res.send(error);
    }
  );
});

export default router;

function getBody() {
  return {
    notifyUrl: 'https://your.eshop.com/notify',
    customerIp: '127.0.0.1',
    merchantPosId: '300746',
    description: 'RTV market',
    currencyCode: 'PLN',
    totalAmount: '21000',
    buyer: {
      email: 'john.doe@example.com',
      phone: '654111654',
      firstName: 'John',
      lastName: 'Doe',
      language: 'pl',
    },
    products: [
      {
        name: 'Wireless Mouse for Laptop',
        unitPrice: '15000',
        quantity: '1',
      },
      {
        name: 'HDMI cable',
        unitPrice: '6000',
        quantity: '1',
      },
    ],
  };
}

function getHeaders() {
  return {
    Content: 'application/json',
    Authorization: 'Bearer d9a4536e-62ba-4f60-8017-6053211d3f47',
    'Content-Type': 'application/json',
  };
}
