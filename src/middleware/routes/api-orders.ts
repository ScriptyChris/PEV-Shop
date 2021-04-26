import getLogger from '../../../utils/logger';
import { Request, Response } from 'express';
import * as expressModule from 'express';
import fetch, { FetchError, RequestInit, Response as FetchResponse, ResponseType } from 'node-fetch';
import { getFromDB } from '../../database/database-index';
import { authToPayU as getToken } from '../features/auth';
import { IPayByLinkMethod, IProductInOrder } from '../../types';
import { getMinAndMaxPrice, getOrderBody, getOrderHeaders, getOrderPaymentMethod } from '../helpers/payu-api';

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

  const token: string | Error = await getToken();
  if (typeof token !== 'string') {
    // TODO: improve error handling
    const payload = {
      errorMsg: 'Server failed to auth to PayU API...',
      error: token,
    };
    res.status(511).json({ payload });
  }

  const [minPrice, maxPrice] = getMinAndMaxPrice(products);
  const payMethod: Partial<IPayByLinkMethod> = await getOrderPaymentMethod(token as string, minPrice, maxPrice);
  logger.log('PayU order /minPrice:', minPrice, ' /maxPrice:', maxPrice, ' /payMethod:', payMethod);

  const PAYU_PAYMENT_URL = process.env.NODE_ENV === 'development' ? PAYMENT_URL.VPS : PAYMENT_URL.PAY_U;
  const requestOptions = {
    method: 'POST',
    redirect: 'manual',
    headers: getOrderHeaders(token as string),
    body: JSON.stringify(getOrderBody(products, payMethod)),
  };

  logger.log('PayU order /PAYU_PAYMENT_URL:', PAYU_PAYMENT_URL, ' /requestOptions:', requestOptions);

  fetch(PAYU_PAYMENT_URL, requestOptions as RequestInit)
    .then(async (response: FetchResponse) => {
      const resValue = await response.json();
      logger.log('PayU order response:', resValue, ' /status:', response.status, ' /statusText:', response.statusText);

      res.status(response.status).json({ payload: resValue });
    })
    .catch((error: FetchError) => {
      logger.error('PayU order error:', error);

      res.status(500).json(error);
    });
});

export default router;
