import getLogger from '../../../utils/logger';
import { Request, Response } from 'express';
import * as expressModule from 'express';
import fetch, { FetchError, RequestInit, Response as FetchResponse } from 'node-fetch';
import { getFromDB } from '../../database/database-index';
import { IProductInOrder } from '../../types';

const {
  // @ts-ignore
  default: { Router },
} = expressModule;
const router = Router();
const logger = getLogger(module.filename);

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

router.post('/api/orders', async (req: Request, res: Response) => {
  logger.log('POST /api/orders env:', process.env.NODE_ENV, ' /req.body:', req.body);

  // TODO: refactor getFromDB function to handle searching by query array
  const products: IProductInOrder[] = await Promise.all(
    req.body.products.map(
      (product: { _id: string; count: number }): Promise<IProductInOrder> =>
        getFromDB(product._id, 'Product').then(({ name, price }) => ({
          name,
          unitPrice: price * 100,
          quantity: product.count,
        }))
    )
  );
  logger.log('products:', products);

  const url = process.env.NODE_ENV === 'development' ? PAYMENT_URL.VPS : PAYMENT_URL.PAY_U;
  const requestOptions = {
    method: 'POST',
    redirect: 'manual',
    headers: getHeaders(),
    body: JSON.stringify(getBody(products)),
  };

  fetch(url, requestOptions as RequestInit)
    .then(async (response: FetchResponse) => {
      const resValue = await response.json();
      logger.log('PayU response:', resValue);

      res.status(response.status).json({ payload: resValue });
    })
    .catch((error: FetchError) => {
      logger.error('PayU error:', error);

      res.send(error);
    });
});

export default router;

function getTotalPrice(products: IProductInOrder[]) {
  return products.reduce((sum: number, { unitPrice, quantity }) => sum + unitPrice * quantity, 0);
}

function getBody(products: IProductInOrder[]) {
  return {
    // notifyUrl: 'http://127.0.0.1:3000',
    customerIp: '127.0.0.1',
    continueUrl: 'http://127.0.0.1:3000/',
    merchantPosId: '300746',
    description: 'RTV market',
    currencyCode: 'PLN',
    totalAmount: getTotalPrice(products), //'21000',
    buyer: {
      email: 'john.doe@example.com',
      phone: '654111654',
      firstName: 'John',
      lastName: 'Doe',
      language: 'pl',
    },
    products /*: [
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
    ]*/,
  };
}

function getHeaders() {
  return {
    Content: 'application/json',
    Authorization: 'Bearer d9a4536e-62ba-4f60-8017-6053211d3f47',
    'Content-Type': 'application/json',
  };
}
