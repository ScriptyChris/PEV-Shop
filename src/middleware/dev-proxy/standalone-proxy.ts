// @ts-ignore
import Express from 'express';
import { Application } from 'express';
// @ts-ignore
import proxy from '../../../../node_modules/webpack-dev-server/node_modules/http-proxy-middleware';
import getLogger from '../../../utils/logger';

const logger = getLogger(module.filename);
const port = Number(process.argv[2]) || 3001;
const url = process.argv[3] || '/dev-proxy';
const target = process.argv[4] || 'https://secure.snd.payu.com/api/v2_1/orders';
const app: Application = Express();

app.use(proxy(url, { target, changeOrigin: true }));
app.listen(port, () => logger.log('Proxy server is listening on port:', port));
