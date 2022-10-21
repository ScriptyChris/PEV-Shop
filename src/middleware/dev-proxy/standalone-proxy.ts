import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import Express, { Request, Response } from 'express';
// @ts-ignore
import proxy from '@root/node_modules/webpack-dev-server/node_modules/http-proxy-middleware';
import getLogger from '@commons/logger';
import { ClientRequest, IncomingMessage } from 'http';

const logger = getLogger(module.filename);
const port = Number(process.argv[2]) || 3001;
const url = process.argv[3] || '/dev-proxy';
const target = process.argv[4] || process.env.PAYU_ORDERS_URL;
const app = Express();

app.use(
  proxy(url, {
    target: target,
    changeOrigin: true,
    ignorePath: true,
    logLevel: 'debug',
    onError(err: unknown, req: Request, res: Response) {
      // debugger;
      logger.log('[onError] err:', err, ' /req:', req, ' /res:', res);
    },
    onProxyReq(proxyReq: ClientRequest, req: Request, res: Response) {
      // debugger;
      logger.log('[onProxyReq] proxyReq.path:', proxyReq.path, ' /headers:', proxyReq.getHeaders());
    },
    onProxyRes(proxyRes: IncomingMessage, req: Request, res: Response) {
      // debugger;
      logger.log(
        '[onProxyRes] proxyRes.statusCode:',
        proxyRes.statusCode,
        ' /statusMessage:',
        proxyRes.statusMessage,
        ' /proxyRes.headers:',
        proxyRes.headers
      );
    },
  })
);
app.listen(port, () => logger.log('Proxy server is listening on port:', port));
