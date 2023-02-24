/**
 * @module
 */

import getLogger from '@commons/logger';
import { Router, Request, Response, NextFunction } from 'express';
import { getFromDB, saveToDB, deleteFromDB } from '@database/api';
import { authMiddlewareFn, userRoleMiddlewareFn } from '@middleware/features/auth';
import { HTTP_STATUS_CODE, IProductInOrder } from '@commons/types';
import { wrapRes } from '@middleware/helpers/middleware-response-wrapper';
import getMiddlewareErrorHandler from '@middleware/helpers/middleware-error-handler';
import { COLLECTION_NAMES, IProduct, USER_ROLES_MAP, OrderModel } from '@database/models';

const router: Router &
  Partial<{
    _handleOrderPreflight: typeof handleOrderPreflight;
    _makeOrder: typeof makeOrder;
  }> = Router();
const logger = getLogger(module.filename);

router.options('/api/orders', handleOrderPreflight);
router.post('/api/orders', authMiddlewareFn, userRoleMiddlewareFn(USER_ROLES_MAP.client), makeOrder);
router.get(
  '/api/orders/current-user',
  authMiddlewareFn,
  userRoleMiddlewareFn(USER_ROLES_MAP.client),
  getCurrentUserOrders
);
router.get('/api/orders/all', authMiddlewareFn, userRoleMiddlewareFn(USER_ROLES_MAP.seller), getAllOrders);
router.delete('/api/orders', /* TODO: [security] add auth */ removeAllOrders);
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
    logger.log('(makeOrder) req.body:', req.body);

    // TODO: refactor getFromDB function to handle searching by query array
    const products: IProductInOrder[] = await Promise.all(
      req.body.products.map(async (product: { _id: string; quantity: number }): Promise<IProductInOrder> => {
        const productDocument = (await getFromDB({ modelName: COLLECTION_NAMES.Product }, product._id)) as IProduct;

        if (!productDocument) {
          throw Error(`Product to be ordered with id '${product._id}' was not found!`);
        }

        return {
          id: productDocument._id,
          unitPrice: productDocument.price,
          quantity: product.quantity,
        };
      })
    );

    const newOrder = OrderModel.createOrder(req.body, products, req.user!._id);
    await saveToDB(COLLECTION_NAMES.Order, newOrder);

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: { orderTimestamp: newOrder.timestamp } });
  } catch (exception) {
    return next(exception);
  }
}

async function getCurrentUserOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userOrders = await req.user!.findCurrentUserOrders();

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: userOrders });
  } catch (exception) {
    return next(exception);
  }
}

async function getAllOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const allOrders = await req.user!.findAllUsersOrders(getFromDB);

    return wrapRes(res, HTTP_STATUS_CODE.OK, { payload: allOrders });
  } catch (exception) {
    return next(exception);
  }
}

async function removeAllOrders(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteFromDB(COLLECTION_NAMES.Order, {});

    return wrapRes(res, HTTP_STATUS_CODE.NO_CONTENT);
  } catch (exception) {
    return next(exception);
  }
}

export default router;
