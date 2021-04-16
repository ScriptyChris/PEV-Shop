import getLogger from '../../../utils/logger';
import { Request, Response } from 'express';
import * as expressModule from 'express';
import fetch, { FetchError, Response as FetchResponse } from 'node-fetch';

const {
    // @ts-ignore
    default: { Router },
} = expressModule;
const router = Router();
const logger = getLogger(module.filename);

enum PAYMENT_URL {
    VPS = 'pev-demo.store/3001',
    PAY_U = 'https://secure.snd.payu.com/api/v2_1/orders',
}

router.post('/api/orders', (req: Request, res: Response) => {
    logger.log('POST /api/orders env:', process.env.NODE_ENV);

    const url = process.env.NODE_ENV === 'development' ? PAYMENT_URL.VPS : PAYMENT_URL.PAY_U;

    fetch(url, {
        headers: getHeaders(),
        body: JSON.stringify(getBody())
    }).then(
        async (res: FetchResponse) => {
            logger.log('PayU response:', await res.text());
        },
        (error: FetchError) => logger.error('PayU error:', error)
    );
});

function getBody() {
    return {
        "notifyUrl": "https://your.eshop.com/notify",
        "customerIp": "127.0.0.1",
        "merchantPosId": "300746",
        "description": "RTV market",
        "currencyCode": "PLN",
        "totalAmount": "21000",
        "buyer": {
            "email": "john.doe@example.com",
            "phone": "654111654",
            "firstName": "John",
            "lastName": "Doe",
            "language": "pl"
        },
        "products": [
            {
                "name": "Wireless Mouse for Laptop",
                "unitPrice": "15000",
                "quantity": "1"
            },
            {
                "name": "HDMI cable",
                "unitPrice": "6000",
                "quantity": "1"
            }
        ]
    }
}

function getHeaders() {
    return {
        Authorization: 'Bearer d9a4536e-62ba-4f60-8017-6053211d3f47',
        'Content-Type': 'application/json',
    }
}
