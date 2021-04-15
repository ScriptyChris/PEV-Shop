// @ts-ignore
import Express from 'express';
import { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import getLogger from '../../../utils/logger';

const logger = getLogger(module.filename);
const port = Number(process.argv[2]) || 3001;
const url = process.argv[3] || '/dev-proxy';
const target = process.argv[4] || 'https://secure.snd.payu.com/api/v2_1/orders';
const app: Application = Express();

app.use(createProxyMiddleware(url, { target }));
app.listen(port, () => logger.log('Proxy server is listening on port:', port));
