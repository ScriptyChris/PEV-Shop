import { Document, Schema, Model, model, COLLECTION_NAMES } from '@database/models/__core-and-commons';
import { PAYMENT_METHODS, SHIPMENT_METHODS, SHIPMENT_METHODS_TO_COSTS } from '@commons/consts';
import type { IOrderPayload, IProductInOrder } from '@commons/types';

const MIN_VALID_ORDER_YEAR = 2023;

const orderedProductSchema = new Schema<IProductInOrder>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // It reflects price at the moment of creating order, so any future product's price changes won't affect already created orders
    unitPrice: {
      type: Number,
      required: true,
      validate(value: number) {
        return value > -1;
      },
    },
    quantity: {
      type: Number,
      required: true,
      validate(value: number) {
        return value > 0;
      },
    },
  },
  {
    toObject: {
      virtuals: true,
    },
  }
);
orderedProductSchema.virtual('productRef', {
  ref: COLLECTION_NAMES.Product,
  localField: 'id',
  foreignField: '_id',
  justOne: true,
});

const orderSchema = new Schema<IOrder>(
  {
    timestamp: {
      type: Number,
      validate(possibleTimestamp: number) {
        const isValidDate = new Date(possibleTimestamp).getFullYear() >= MIN_VALID_ORDER_YEAR;
        return isValidDate && possibleTimestamp <= Date.now();
      },
      required: true,
    },
    receiver: {
      name: String,
      email: String,
      phone: String,
    },
    payment: {
      method: {
        type: String,
        validate(possiblePaymentMethod: any) {
          return Object.values(PAYMENT_METHODS).includes(possiblePaymentMethod);
        },
        required: true,
      },
    },
    shipment: {
      method: {
        type: String,
        validate(possibleShipmentMethod: any) {
          return Object.values(SHIPMENT_METHODS).includes(possibleShipmentMethod);
        },
        required: true,
      },
      address: {
        type: Schema.Types.Mixed,
        validate(value: any) {
          switch (this.shipment.method) {
            case SHIPMENT_METHODS.IN_PERSON: {
              return typeof value === 'string' && value;
            }
            case SHIPMENT_METHODS.HOME: {
              const validStreetAndApartmentNumber =
                typeof value?.streetAndApartmentNumber === 'string' && value.streetAndApartmentNumber;
              const validPostalCode = typeof value?.postalCode === 'string' && value.postalCode;
              const validCity = typeof value?.city === 'string' && value.city;

              return !!(validStreetAndApartmentNumber && validPostalCode && validCity);
            }
            case SHIPMENT_METHODS.PARCEL_LOCKER: {
              const validName = typeof value?.name && value.name;
              const validLocation = Array.isArray(value?.location) && value.location.length;

              return !!(validName && validLocation);
            }
            default: {
              return false;
            }
          }
        },
      },
    },
    regardingUser: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.User,
      required: true,
    },
    regardingProducts: {
      type: [orderedProductSchema],
      required: true,
      validate(value: any[]) {
        return value.length > 0;
      },
    },
  },
  { toObject: { virtuals: true } }
);
orderSchema.virtual('cost').get(function (value: any, virtual: any, doc: IOrder) {
  const productsCost = doc.regardingProducts.reduce((sum, { unitPrice, quantity }) => sum + unitPrice * quantity, 0);
  const shipmentCost =
    SHIPMENT_METHODS_TO_COSTS[doc.shipment.method as typeof SHIPMENT_METHODS[keyof typeof SHIPMENT_METHODS]];
  const totalCost = productsCost + shipmentCost;

  return {
    products: productsCost,
    shipment: shipmentCost,
    total: totalCost,
  };
});

type TCreateOrderParams = Parameters<IOrderModel['createOrder']>;
orderSchema.statics.createOrder = (
  orderPayload: TCreateOrderParams[0],
  products: TCreateOrderParams[1],
  regardingUser: TCreateOrderParams[2]
) => {
  const newOrder = new OrderModel({
    timestamp: Date.now(),
    receiver: orderPayload.receiver,
    payment: {
      method: orderPayload.payment.method,
    },
    shipment: {
      method: orderPayload.shipment.method,
      address: orderPayload.shipment.address,
    },
    regardingUser,
    regardingProducts: products,
  });

  return newOrder;
};

export const OrderModel = model<IOrder, IOrderModel>(COLLECTION_NAMES.Order, orderSchema);

interface IOrderModel extends Model<IOrder> {
  createOrder(
    orderPayload: IOrderPayload,
    products: IOrder['regardingProducts'],
    regardingUser: Schema.Types.ObjectId
  ): IOrder;
}

export interface IOrder extends Document, Pick<IOrderPayload, 'receiver'> {
  timestamp: number;
  receiver: IOrderPayload['receiver'];
  cost?: {
    products: number;
    shipment: number;
    total: number;
  };
  payment: {
    method: IOrderPayload['payment']['method'];
  };
  shipment: {
    method: IOrderPayload['shipment']['method'];
    price?: number;
  };
  regardingUser: Schema.Types.ObjectId;
  regardingProducts: IProductInOrder[];
}
