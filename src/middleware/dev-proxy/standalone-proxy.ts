// @ts-ignore
import Express, { Request, Response } from 'express';
import { Application } from 'express';
// @ts-ignore
import proxy from '../../../../node_modules/webpack-dev-server/node_modules/http-proxy-middleware';
import getLogger from '../../../utils/logger';
import { ClientRequest, IncomingMessage } from 'http';

const logger = getLogger(module.filename);
const port = Number(process.argv[2]) || 3001;
const url = process.argv[3] || '/dev-proxy';
const target = process.argv[4] || 'https://secure.snd.payu.com/api/v2_1/orders';
const app: Application = Express();

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
