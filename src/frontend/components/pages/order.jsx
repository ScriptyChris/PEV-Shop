import '@frontend/assets/styles/views/order.scss';

import React, { memo, useState, useEffect, useRef, useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';

import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import HomeIcon from '@material-ui/icons/Home';
import MailboxIcon from '@material-ui/icons/MarkunreadMailbox';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CloseIcon from '@material-ui/icons/Close';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ShopIcon from '@material-ui/icons/Shop';

import storeService from '@frontend/features/storeService';
import httpService from '@frontend/features/httpService';
import {
  PEVButton,
  PEVHeading,
  PEVParagraph,
  PEVForm,
  PEVFieldset,
  PEVLegend,
  PEVTextField,
  PEVRadio,
  PEVFormFieldError,
  PEVTabs,
} from '@frontend/components/utils/pevElements';
import { ROUTES } from '@frontend/components/pages/_routes';
import { SHIPMENT_METHODS, SHOP_ADDRESS } from '@commons/consts';
import Popup, { POPUP_TYPES } from '@frontend/components/utils/popup';

const translations = Object.freeze({
  mainHeading: 'Prepare order',
  summaryHeading: 'Summary',
  orderReceiver: 'Receiver',
  orderShipmentChooser: 'Order shipment chooser',
  shipmentHeading: 'Shipment',
  paymentHeading: 'Payment',
  inPersonShipment: 'In person',
  inPersonShipmentHeading: 'Pick up your purchase personally at our store!',
  homeShipment: 'Home',
  homeShipmentHeading: 'Fill address information',
  parcelLockerShipment: 'Parcel locker',
  chooseParcelLocker: 'Choose parcel locker location',
  changeParcelLocker: 'Change location',
  chosenParcelLocker: 'Chosen parcel locker',
  closeParcelsMap: 'Close map',
  receiverName: 'Name',
  receiverEmail: 'Email',
  receiverPhone: 'Phone number',
  shipmentAddress1: 'Street and apartment number',
  shipmentAddress2: 'Postal code',
  shipmentAddress3: 'City',
  forFree: 'free',
  paymentMethods: {
    cash: 'Cash',
    card: 'Card',
    transfer: 'Transfer',
    blik: 'BLIK',
  },
  productsValue: 'Products',
  shipmentValue: 'Shipment',
  totalValue: 'Total',
  completeOrder: 'Complete order',
  orderSuccessMsg: 'Order created!',
  goToAccountOrders: 'Go to your orders',
  errorUnchosenShipmentMethod: 'Choose shipment method!',
  errorUnchosenParcelLocker: 'Choose parcel locker location!',
});

const getPresentedPrice = (price) => {
  if (typeof price !== 'number') {
    return '-';
  } else if (price === 0) {
    return translations.forFree;
  }

  // TODO: [UX] show price according to chosen currency
  return `$${price}`;
};

const ParcelsMap = memo(
  function ParcelsMap({ setParcelLocker, isRendered, mapOpenerSetterRef }) {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
      mapOpenerSetterRef.current = setIsOpen;

      function onShipmentMapMessage(event) {
        if (event.data?.sender === 'shipment-map' && event.origin === window.location.origin) {
          console.log('(onShipmentMapMessage) event.data:', event.data);

          const { address, name } = event.data.point;
          const location = Object.values(address);

          setParcelLocker({ name, location });
          setIsOpen(false);
        }
      }

      window.addEventListener('message', onShipmentMapMessage);

      return () => {
        window.removeEventListener('message', onShipmentMapMessage);
      };
    }, []);

    const handleClose = () => setIsOpen(false);

    if (!isRendered) {
      return null;
    }

    return (
      <Dialog className="shipment-parcel__map-popup" fullScreen open={isOpen} onClose={handleClose} keepMounted>
        <PEVButton
          className="shipment-parcel__map-close-btn"
          onClick={handleClose}
          startIcon={<CloseIcon />}
          variant="text"
        >
          {translations.closeParcelsMap}
        </PEVButton>
        <iframe
          src="/embedded/shipment-map.html"
          className="shipment-parcel__locker-map"
          data-cy="iframe:parcel-locker-map"
        ></iframe>
      </Dialog>
    );
  },
  (prevProps, nextProps) => prevProps.isRendered === nextProps.isRendered
);

function BasicReceiverInfo() {
  const basicFields = [
    {
      name: 'receiver.name',
      identity: 'name',
      label: translations.receiverName,
      'data-cy': 'input:receiver-name',
    },
    {
      name: 'receiver.email',
      identity: 'email',
      type: 'email',
      label: translations.receiverEmail,
      'data-cy': 'input:receiver-email',
    },
    {
      name: 'receiver.phone',
      identity: 'phone',
      type: 'tel',
      label: translations.receiverPhone,
      'data-cy': 'input:receiver-phone',
    },
  ];

  return (
    <Paper component="section" className="order__basic-receiver-info">
      <PEVFieldset className="pev-flex pev-flex--columned basic-receiver-info__fieldset">
        <PEVLegend className="basic-receiver-info__legend">
          <PEVHeading level={3}>{translations.orderReceiver}</PEVHeading>
        </PEVLegend>

        {basicFields.map((field) => (
          <div className="pev-flex pev-flex--columned basic-receiver-info__field" key={field.identity}>
            <PEVTextField {...field} required />
          </div>
        ))}
      </PEVFieldset>
    </Paper>
  );
}

const Shipment = memo(function _Shipment({ formInitialsShipmentExtender, updateChosenShipmentPrice }) {
  const { setFieldValue, errors, setFieldError } = useFormikContext();

  // TODO: this should be (at least partially) received from backend and be configurable by seller
  const tabsConfig = useMemo(
    () => ({
      groupName: 'shipment',
      initialData: [
        {
          name: SHIPMENT_METHODS.IN_PERSON,
          translation: translations.inPersonShipment,
          icon: <EmojiPeopleIcon />,
          content: <Shipment.InPerson formInitialsShipmentExtender={formInitialsShipmentExtender} />,
          ribbon: {
            value: 0,
            transformer: getPresentedPrice,
          },
        },
        {
          name: SHIPMENT_METHODS.HOME,
          translation: translations.homeShipment,
          icon: <HomeIcon />,
          content: <Shipment.Home formInitialsShipmentExtender={formInitialsShipmentExtender} />,
          ribbon: {
            value: 5,
            transformer: getPresentedPrice,
          },
        },
        {
          name: SHIPMENT_METHODS.PARCEL_LOCKER,
          translation: translations.parcelLockerShipment,
          icon: <MailboxIcon />,
          content: <Shipment.ParcelLocker formInitialsShipmentExtender={formInitialsShipmentExtender} />,
          ribbon: {
            value: 2,
            transformer: getPresentedPrice,
          },
        },
      ],
      onTabChangeCallbacks: [
        ({ name }) => setFieldValue('shipment.method', name),
        ({ ribbon: { value: shipmentPrice } }) => updateChosenShipmentPrice(shipmentPrice),
        () => setFieldError('shipment.method', ''),
      ],
    }),
    [formInitialsShipmentExtender]
  );

  return (
    <Paper component="section" className="order__shipment" data-cy="container:order-shipment">
      <header>
        <PEVHeading level={3} className="order-heading">
          {translations.shipmentHeading}
        </PEVHeading>
      </header>

      <PEVTabs config={tabsConfig} label={translations.orderShipmentChooser} areChoosersScrollable />

      {errors.shipment?.method && <PEVFormFieldError customMessage={errors.shipment.method} />}
    </Paper>
  );
});
Shipment.InPerson = function InPerson({ formInitialsShipmentExtender }) {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    const address = SHOP_ADDRESS.join(',');

    formInitialsShipmentExtender('inPerson', address);
    setFieldValue('shipment.address.inPerson', address);
  }, []);

  return (
    <section className="pev-flex pev-flex--columned shipment-in-person">
      <header>
        <PEVHeading level={4} className="pev-centered-padded-text">
          {translations.inPersonShipmentHeading}
        </PEVHeading>
      </header>
      <address className="shipment-in-person__address">
        {SHOP_ADDRESS.map((address) => (
          <span key={address}>{address}</span>
        ))}
      </address>
    </section>
  );
};

Shipment.Home = function Home({ formInitialsShipmentExtender }) {
  const { setFieldValue, values } = useFormikContext();
  const fields = [
    {
      identity: 'shipment.address.home.streetAndApartmentNumber',
      label: translations.shipmentAddress1,
      'data-cy': 'input:home-shipment-address1',
    },
    {
      identity: 'shipment.address.home.postalCode',
      label: translations.shipmentAddress2,
      'data-cy': 'input:home-shipment-address2',
    },
    {
      identity: 'shipment.address.home.city',
      label: translations.shipmentAddress3,
      'data-cy': 'input:home-shipment-address3',
    },
  ];
  fields.createDefaultValue = (identity) => {
    const fieldIdentitySuffix = identity.split('.').pop();

    return values.shipment?.address?.home?.[fieldIdentitySuffix] ?? '';
  };
  fields.forEach((field) => (field.defaultValue = fields.createDefaultValue(field.identity)));

  useEffect(() => {
    const homeAddressSchema = Object.fromEntries(
      fields.map(({ identity, defaultValue }) => {
        const identitySuffix = identity.split('.').pop();
        return [identitySuffix, defaultValue];
      })
    );

    formInitialsShipmentExtender('home', homeAddressSchema);
    setFieldValue('shipment.address.home', homeAddressSchema);
  }, []);

  return (
    <PEVFieldset className="pev-flex pev-flex--columned shipment-home__fieldset">
      <PEVLegend className="pev-centered-padded-text">
        <PEVHeading level={4}>{translations.homeShipmentHeading}</PEVHeading>
      </PEVLegend>

      {fields.map((field) => (
        <div className="pev-flex pev-flex--columned shipment-home__field" key={field.identity}>
          <PEVTextField {...field} required />
        </div>
      ))}
    </PEVFieldset>
  );
};

Shipment.ParcelLocker = function ParcelLocker({ formInitialsShipmentExtender }) {
  const { values, setFieldValue, errors, setFieldError } = useFormikContext();
  const [parcelLocker, setParcelLocker] = useState(() =>
    Object.values(values.shipment?.address?.parcelLocker || {}).every(Boolean)
      ? values.shipment.address.parcelLocker
      : null
  );
  const [isMapRendered, setIsMapRendered] = useState(false);
  const mapOpener = useRef(null);
  const handleShowMap = () => {
    if (!isMapRendered) {
      setIsMapRendered(true);
    } else {
      mapOpener?.current?.(true);
    }
  };

  useEffect(() => {
    const parcelLockerAddress = {
      name: '',
      location: [],
    };

    formInitialsShipmentExtender('parcelLocker', parcelLockerAddress);
    setFieldValue('shipment.address.parcelLocker', parcelLockerAddress);

    return () => setFieldError('shipment.address.parcelLocker', '');
  }, []);

  useEffect(() => {
    if (!parcelLocker) {
      return;
    }

    setFieldValue('shipment.address.parcelLocker.name', parcelLocker.name);
    setFieldValue('shipment.address.parcelLocker.location', parcelLocker.location);
  }, [parcelLocker]);

  return (
    <>
      <div className="order__shipment--parcel-locker">
        {parcelLocker && (
          <>
            <PEVParagraph className="shipment-parcel__name">
              <strong>
                {translations.chosenParcelLocker}:{' '}
                {parcelLocker.name && <em data-cy="output:parcel-locker-name">{parcelLocker.name}</em>}
              </strong>
            </PEVParagraph>
            {parcelLocker.location && (
              <address className="shipment-parcel__address" data-cy="output:parcel-locker-address">
                {parcelLocker.location.map((addressLine) => (
                  <span key={addressLine}>{addressLine}</span>
                ))}
              </address>
            )}
          </>
        )}

        <PEVButton
          className="shipment-parcel__show-map-btn"
          onClick={handleShowMap}
          startIcon={parcelLocker ? <EditLocationIcon /> : <AddLocationIcon />}
          variant={parcelLocker ? 'outlined' : 'contained'}
          color={parcelLocker ? 'default' : 'primary'}
          data-cy="button:shipment__parcelLocker-location-selector"
        >
          {parcelLocker ? translations.changeParcelLocker : translations.chooseParcelLocker}
        </PEVButton>

        <ParcelsMap setParcelLocker={setParcelLocker} isRendered={isMapRendered} mapOpenerSetterRef={mapOpener} />
      </div>
      {errors.shipment?.address?.parcelLocker && (
        <PEVFormFieldError customMessage={errors.shipment.address.parcelLocker} />
      )}
    </>
  );
};

function Payment() {
  const [chosenPayment, setChosenPayment] = useState('');
  // TODO: take it from backend
  const payments = [
    {
      name: 'cash',
      get label() {
        return translations.paymentMethods[this.name];
      },
      icon: <MonetizationOnIcon />,
    },
    {
      name: 'card',
      get label() {
        return translations.paymentMethods[this.name];
      },
      icon: <CreditCardIcon />,
    },
    {
      name: 'transfer',
      get label() {
        return translations.paymentMethods[this.name];
      },
      icon: <AccountBalanceIcon />,
    },
    {
      name: 'blik',
      get label() {
        return translations.paymentMethods[this.name];
      },
      icon: <div>?</div>,
    },
  ];

  return (
    <Paper component="section" className="order__payment">
      <header>
        <PEVHeading id="payment-heading" level={3} className="order-heading">
          {translations.paymentHeading}
        </PEVHeading>
      </header>

      <PEVFieldset className="order__payment-list" aria-labelledby="payment-heading">
        {payments.map(({ name, icon, label }) => (
          <InputLabel
            onChange={() => setChosenPayment(name)}
            className={classNames(`payment-option__label`, {
              'payment-option__label--checked': chosenPayment === name,
            })}
            htmlFor={name}
            color="primary"
            key={name}
          >
            <PEVRadio
              className="payment-option__input"
              name="payment.method"
              label={label}
              icon={icon}
              checkedIcon={icon}
              color="primary"
              value={name}
              identity={name}
              id={name}
              dataCy={`input:choose-${name}-payment`}
              required
              disableRipple
              noExplicitlyVisibleLabel
            />
            <span className="payment-option__label-content">{label}</span>
          </InputLabel>
        ))}
      </PEVFieldset>
    </Paper>
  );
}

const useOrderFormInitials = () => {
  const [formInitials, setFormInitials] = useState({
    receiver: {
      name: '',
      email: '',
      phone: '',
    },
    payment: {
      method: '',
    },
    shipment: {
      method: '',
      address: '',
    },
  });

  const formInitialsExtender = {
    shipment: (method, newAddress) => {
      setFormInitials((prev) => ({
        ...prev,
        shipment: {
          ...prev.shipment,
          address: {
            ...prev.shipment.address,
            [method]: newAddress,
          },
        },
      }));
    },
  };

  return { formInitials, formInitialsExtender };
};

export function OrderSummary({ headingLevel, containerClassName, shipmentPrice, productsPrice, totalCost }) {
  return (
    <>
      <PEVHeading level={headingLevel} className="summary__heading">
        {translations.summaryHeading}
      </PEVHeading>

      <TableContainer elevation={0} className={classNames('summary__table-container', containerClassName)}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {translations.productsValue}
              </TableCell>
              <TableCell>{getPresentedPrice(productsPrice)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                {translations.shipmentValue}
              </TableCell>
              <TableCell>{getPresentedPrice(shipmentPrice)}</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter className="summary__total-value">
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>{translations.totalValue}</strong>
              </TableCell>
              <TableCell>
                <strong>{getPresentedPrice(totalCost)}</strong>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

export default function Order() {
  const { formInitials, formInitialsExtender } = useOrderFormInitials();
  const [chosenShipmentPrice, setChosenShipmentPrice] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const history = useHistory();
  const totalCost = storeService.userCartTotalPrice + chosenShipmentPrice;

  const handleSubmit = (values) => {
    const orderDetails = {
      ...values,
      shipment: {
        ...values.shipment,
        address: values.shipment.address[values.shipment.method],
      },
      products: storeService.userCartProducts.map(({ quantity, _id }) => ({ quantity, _id })),
    };

    httpService.makeOrder(orderDetails).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      storeService.clearUserCartState();

      // TODO: [feature] recover integration with PayU API
      // window.location = res.redirectUri;

      setPopupData({
        type: POPUP_TYPES.SUCCESS,
        dataCy: 'popup:order-successfully-created',
        message: translations.orderSuccessMsg,
        singleAltBtn: {
          onClick: () => {
            setPopupData(null);
            history.replace({ pathname: ROUTES.ACCOUNT__ORDERS, search: `?chosenTimestamp=${res.orderTimestamp}` });
          },
          text: translations.goToAccountOrders,
          dataCy: 'button:go-to-orders',
        },
      });
    });
  };

  const handleValidate = (values) => {
    const errors = {};

    if (!values.shipment.method) {
      errors.shipment.method = translations.errorUnchosenShipmentMethod;
    }
    // TODO: [DX] rather move to ParcelShipment component (and expose function), because "it should know" best how to validate itself
    else if (values.shipment.method === 'parcelLocker') {
      const parcelLockerAddress = values.shipment?.address?.parcelLocker;

      if (
        parcelLockerAddress &&
        (!Array.isArray(parcelLockerAddress.location) ||
          parcelLockerAddress.location.length === 0 ||
          parcelLockerAddress.name === '')
      ) {
        errors.shipment = {
          address: {
            parcelLocker: translations.errorUnchosenParcelLocker,
          },
        };
      }
    }

    return errors;
  };

  return (
    <article className="order pev-fixed-container pev-flex pev-flex--columned">
      <header>
        <PEVHeading level={2} className="pev-centered-padded-text">
          {translations.mainHeading}
        </PEVHeading>
      </header>

      <PEVForm
        className="order__form pev-flex pev-flex--columned"
        initialValues={formInitials}
        validateOnChange={false}
        validateOnBlur={false}
        validate={handleValidate}
        onSubmit={handleSubmit}
        id="order-form"
      >
        <BasicReceiverInfo />
        <Shipment
          formInitialsShipmentExtender={formInitialsExtender.shipment}
          updateChosenShipmentPrice={setChosenShipmentPrice}
        />
        <Payment />

        <Paper component="footer" className="order__summary pev-flex pev-flex--columned">
          <OrderSummary
            headingLevel={3}
            shipmentPrice={chosenShipmentPrice}
            productsPrice={storeService.userCartTotalPrice}
            totalCost={totalCost}
          />
        </Paper>
      </PEVForm>

      <PEVButton
        className="order__form-submit-btn"
        variant="contained"
        color="primary"
        startIcon={<ShopIcon />}
        form="order-form"
        type="submit"
        data-cy="button:submit-order"
      >
        {translations.completeOrder}
      </PEVButton>

      <Popup {...popupData} />
    </article>
  );
}
