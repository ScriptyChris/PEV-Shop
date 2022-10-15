import getLogger from '@commons/logger';
import { Router, Request, Response, NextFunction } from 'express';
import fetch, { RequestInit, Response as FetchResponse } from 'node-fetch';
import { getFromDB } from '@database/database-index';
import { authToPayU as getToken } from '@middleware/features/auth';
import { HTTP_STATUS_CODE, IPayByLinkMethod, IProductInOrder } from '@src/types';
import { getMinAndMaxPrice, getOrderBody, getOrderHeaders, getOrderPaymentMethod } from '@middleware/helpers/payu-api';
import { wrapRes, TypeOfHTTPStatusCodes } from '@middleware/helpers/middleware-response-wrapper';
import getMiddlewareErrorHandler from '@middleware/helpers/middleware-error-handler';
import { COLLECTION_NAMES } from '@database/models';

const router: Router &
  Partial<{
    _handleOrderPreflight: typeof handleOrderPreflight;
    _makeOrder: typeof makeOrder;
  }> = Router();
const logger = getLogger(module.filename);

enum PAYMENT_URL {
  VPS = 'http://pev-demo.store:3001/dev-proxy',
  PAY_U = 'https://secure.snd.payu.com/api/v2_1/orders',
}

router.options('/api/orders', handleOrderPreflight);
router.post('/api/orders', makeOrder);
router.use(getMiddlewareErrorHandler(logger));

// expose for unit tests
router._handleOrderPreflight = handleOrderPreflight;
router._makeOrder = makeOrder;

function handleOrderPreflight(req: Request, res: Response) {
  logger.log('OPTIONS /api/orders:', req.headers);

  res.setHeader('Access-Control-Allow-Headers', 'authorization,content,content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  return res.send();
}

async function makeOrder(req: Request, res: Response, next: NextFunction) {
  try {
    logger.log('POST /api/orders env:', process.env.NODE_ENV, ' /req.body:', req.body);

    // TODO: refactor getFromDB function to handle searching by query array
    const products: IProductInOrder[] = await Promise.all(
      req.body.products.map(
        (product: { _id: string; count: number }): Promise<IProductInOrder> =>
          getFromDB(product._id, COLLECTION_NAMES.Product).then(({ name, price }) => ({
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
      return wrapRes(res, HTTP_STATUS_CODE.NETWORK_AUTH_REQUIRED, {
        exception: Error(`Server failed to auth to PayU API due to: ${token?.message}`),
      });
    }

    const [minPrice, maxPrice] = getMinAndMaxPrice(products);
    const payMethod: Partial<IPayByLinkMethod> = await getOrderPaymentMethod(token as string, minPrice, maxPrice);
    logger.log('PayU order /minPrice:', minPrice, ' /maxPrice:', maxPrice, ' /payMethod:', payMethod);

    const PAYU_PAYMENT_URL: string = process.env.NODE_ENV === 'development' ? PAYMENT_URL.VPS : PAYMENT_URL.PAY_U;
    const requestOptions = {
      method: 'POST',
      redirect: 'manual',
      headers: getOrderHeaders(token as string),
      body: JSON.stringify(getOrderBody(products, payMethod)),
    };

    logger.log('PayU order /PAYU_PAYMENT_URL:', PAYU_PAYMENT_URL, ' /requestOptions:', requestOptions);

    return await fetch(PAYU_PAYMENT_URL, requestOptions as RequestInit).then(async (response: FetchResponse) => {
      const resValue = await response.json();
      logger.log('PayU order response:', resValue, ' /status:', response.status, ' /statusText:', response.statusText);

      // TODO: [REFACTOR] respond with either 'msg', 'payload' or 'error' depending or `response.status`
      return wrapRes(
        res,
        response.status as Extract<TypeOfHTTPStatusCodes, 'SUCCESSFUL' | 'CLIENT_ERROR' | 'SERVER_ERROR'>,
        { payload: resValue }
      );
    });
  } catch (exception) {
    return next(exception);
  }
}

export default router;
