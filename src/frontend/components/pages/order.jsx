import React, { memo, useState, useEffect, useRef, useMemo } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
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
} from '@frontend/components/utils/pevElements';
import Scroller from '@frontend/components/utils/scroller';

const translations = Object.freeze({
  mainHeading: 'Shipment and payment',
  summaryHeading: 'Summary',
  orderReceiver: 'Receiver',
  orderShipmentChooser: 'Order shipment chooser',
  shipmentHeading: 'Shipment',
  paymentHeading: 'Payment',
  inPersonShipment: 'In person',
  inPersonShipmentHeading: 'Pick up your purchase personally at our store',
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
  receiverAddress1: 'Street and apartment number',
  receiverAddress2: 'Postal code',
  receiverAddress3: 'City',
  forFree: 'free',
  productsValue: 'Products',
  shipmentValue: 'Shipment',
  totalValue: 'Total',
  makeOrder: 'Make order',
  errorUnchosenShipmentType: 'Choose shipment type!',
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
        <iframe src="/embedded/shipment-map.html" className="shipment-parcel__locker-map"></iframe>
      </Dialog>
    );
  },
  (prevProps, nextProps) => prevProps.isRendered === nextProps.isRendered
);

function BasicReceiverInfo() {
  const basicFields = [
    {
      name: 'receiver.baseInfo.name',
      identity: 'name',
      label: translations.receiverName,
      'data-cy': 'input:receiver-name',
    },
    {
      name: 'receiver.baseInfo.email',
      identity: 'email',
      type: 'email',
      label: translations.receiverEmail,
      'data-cy': 'input:receiver-email',
    },
    {
      name: 'receiver.baseInfo.phone',
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

function InPersonShipment({ formInitialsShipmentExtender }) {
  // TODO: [UX] get it from backend - seller should be able to configure it
  const shopAddress = ['PEV Shop', 'ul. Testowa 1', '12-345 Testolandia'];
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    const address = shopAddress.join(',');

    formInitialsShipmentExtender('inPerson', address);
    setFieldValue('receiver.address.inPerson', address);
  }, []);

  return (
    <section className="pev-flex pev-flex--columned shipment-in-person">
      <header>
        <PEVHeading level={4} className="pev-centered-padded-text">
          {translations.inPersonShipmentHeading}
        </PEVHeading>
      </header>
      <address className="shipment-in-person__address">
        {shopAddress.map((address) => (
          <span key={address}>{address}</span>
        ))}
      </address>
    </section>
  );
}

function HomeShipment({ formInitialsShipmentExtender }) {
  const { setFieldValue, values } = useFormikContext();
  const fields = [
    {
      identity: 'receiver.address.home.streetAndApartmentNumber',
      label: translations.receiverAddress1,
      'data-cy': 'input:receiver-address1',
    },
    {
      identity: 'receiver.address.home.postalCode',
      label: translations.receiverAddress2,
      'data-cy': 'input:receiver-address2',
    },
    {
      identity: 'receiver.address.home.city',
      label: translations.receiverAddress3,
      'data-cy': 'input:receiver-address3',
    },
  ];
  fields.createDefaultValue = (identity) => {
    const fieldIdentitySuffix = identity.split('.').pop();

    return values.receiver?.address?.home?.[fieldIdentitySuffix] ?? '';
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
    setFieldValue('receiver.address.home', homeAddressSchema);
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
}

function PackageShipment({ formInitialsShipmentExtender }) {
  const { values, setFieldValue, errors, setFieldError } = useFormikContext();
  const [parcelLocker, setParcelLocker] = useState(
    Object.values(values.receiver?.address?.parcelLocker || {}).every(Boolean)
      ? values.receiver.address.parcelLocker
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
    setFieldValue('receiver.address.parcelLocker', parcelLockerAddress);

    return () => setFieldError('receiver.address.parcelLocker', '');
  }, []);

  useEffect(() => {
    if (!parcelLocker) {
      return;
    }

    setFieldValue('receiver.address.parcelLocker.name', parcelLocker.name);
    setFieldValue('receiver.address.parcelLocker.location', parcelLocker.location);
  }, [parcelLocker]);

  return (
    <>
      <div className="order__shipment--parcel-locker">
        {parcelLocker && (
          <>
            <PEVParagraph className="shipment-parcel__name">
              <strong>
                {translations.chosenParcelLocker}: {parcelLocker.name && <em>{parcelLocker.name}</em>}
              </strong>
            </PEVParagraph>
            {parcelLocker.location && (
              <address className="shipment-parcel__address">
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
        >
          {parcelLocker ? translations.changeParcelLocker : translations.chooseParcelLocker}
        </PEVButton>

        <ParcelsMap setParcelLocker={setParcelLocker} isRendered={isMapRendered} mapOpenerSetterRef={mapOpener} />
      </div>
      {errors.receiver?.address?.parcelLocker && (
        <PEVFormFieldError customMessage={errors.receiver.address.parcelLocker} />
      )}
    </>
  );
}

const tabsHelper = (tabsGroupName, tabsData) => {
  const createId = (tabPart, name) => `${tabsGroupName}-tab-${tabPart}__${name}`;
  const createA11yObj = (txt, relatedId) => ({
    'aria-label': txt,
    'aria-controls': relatedId,
    label: txt,
    title: txt,
  });

  return tabsData.reduce(
    (output, { name, translation, icon, content, shipmentPrice }, index) => {
      output.tabChoosers.push({
        get id() {
          return createId('chooser', name);
        },
        get a11y() {
          return createA11yObj(translation, output.tabPanels[index].id);
        },
        name,
        icon,
        shipmentPrice,
        shipmentPresentedPrice: getPresentedPrice(shipmentPrice),
      });
      output.tabPanels.push({
        content,
        get id() {
          return createId('panel', name);
        },
      });

      return output;
    },
    { tabChoosers: [], tabPanels: [] }
  );
};

function TabPanel({ children, value, index, id, relatedTabId }) {
  return (
    <div id={id} role="tabpanel" aria-labelledby={relatedTabId} hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

const Shipment = memo(function Shipment({ formInitialsShipmentExtender, updateChosenShipmentPrice }) {
  const { setFieldValue, errors, setFieldError } = useFormikContext();
  const [tabValue, setTabValue] = useState(false);
  // TODO: this should be (at least partially) received from backend and be configurable by seller
  const shipmentMethods = useMemo(
    () =>
      tabsHelper('shipment', [
        {
          name: 'inPerson',
          translation: translations.inPersonShipment,
          shipmentPrice: 0,
          icon: <EmojiPeopleIcon />,
          content: <InPersonShipment formInitialsShipmentExtender={formInitialsShipmentExtender} />,
        },
        {
          name: 'home',
          translation: translations.homeShipment,
          shipmentPrice: 5,
          icon: <HomeIcon />,
          content: <HomeShipment formInitialsShipmentExtender={formInitialsShipmentExtender} />,
        },
        {
          name: 'parcelLocker',
          translation: translations.parcelLockerShipment,
          shipmentPrice: 2,
          icon: <MailboxIcon />,
          content: <PackageShipment formInitialsShipmentExtender={formInitialsShipmentExtender} />,
        },
      ]),
    [formInitialsShipmentExtender]
  );

  const handleTabChange = (_, newTabValue) => {
    const tabChooser = shipmentMethods.tabChoosers[newTabValue];

    setFieldValue('shipmentType', tabChooser.name);
    setTabValue(newTabValue);
    updateChosenShipmentPrice(tabChooser.shipmentPrice);
    setFieldError('shipmentType', '');
  };

  return (
    <Paper component="section" className="order__shipment">
      <header>
        <PEVHeading level={3} className="order-heading">
          {translations.shipmentHeading}
        </PEVHeading>
      </header>
      <div className="order__shipment-tabs">
        <Scroller
          scrollerBaseValueMeta={{
            useDefault: true,
          }}
          render={({ ScrollerHookingParent }) => (
            <ScrollerHookingParent>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                aria-label={translations.orderShipmentChooser}
              >
                {shipmentMethods.tabChoosers.map(({ id, icon, a11y, shipmentPresentedPrice }) => (
                  <Tab
                    className="order__shipment-tab"
                    data-presented-price={shipmentPresentedPrice}
                    icon={icon}
                    {...a11y}
                    id={id}
                    key={id}
                  />
                ))}
              </Tabs>
            </ScrollerHookingParent>
          )}
        />
      </div>
      {shipmentMethods.tabPanels.map(({ content, id }, index) => (
        <TabPanel
          value={tabValue}
          index={index}
          id={id}
          relatedTabId={shipmentMethods.tabChoosers[index].id}
          key={index}
        >
          {content}
        </TabPanel>
      ))}
      {errors.shipmentType && <PEVFormFieldError customMessage={errors.shipmentType} />}
    </Paper>
  );
});

function Payment() {
  const [chosenPayment, setChosenPayment] = useState('');
  // TODO: take it from backend
  const payments = [
    { name: 'Cash', icon: <MonetizationOnIcon /> },
    {
      name: 'Card',
      icon: <CreditCardIcon />,
    },
    {
      name: 'Transfer',
      icon: <AccountBalanceIcon />,
    },
    {
      name: 'BLIK',
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
        {payments.map(({ name, icon }) => (
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
              name="paymentType"
              label={name}
              icon={icon}
              checkedIcon={icon}
              color="primary"
              value={name}
              identity={name}
              id={name}
              required
              disableRipple
              noExplicitlyVisibleLabel
            />
            <span className="payment-option__label-content">{name}</span>
          </InputLabel>
        ))}
      </PEVFieldset>
    </Paper>
  );
}

const useOrderFormInitials = () => {
  const [formInitials, setFormInitials] = useState({
    receiver: {
      baseInfo: {
        name: '',
        email: '',
        phone: '',
      },
      address: '',
    },
    shipmentType: '',
    paymentType: '',
  });

  const formInitialsExtender = {
    shipment: (type, newAddress) => {
      setFormInitials((prev) => ({
        ...prev,
        receiver: {
          ...prev.receiver,
          address: {
            ...prev.receiver.address,
            [type]: newAddress,
          },
        },
      }));
    },
  };

  return { formInitials, formInitialsExtender };
};

export default function Order() {
  const { formInitials, formInitialsExtender } = useOrderFormInitials();
  const [chosenShipmentPrice, setChosenShipmentPrice] = useState(null);
  const totalPrice = storeService.userCartTotalPrice + chosenShipmentPrice;

  const handleSubmit = (values) => {
    const orderDetails = {
      ...values,
      receiver: {
        ...values.receiver,
        address: values.receiver.address[values.shipmentType],
      },
      products: storeService.userCartProducts,
      price: {
        shipment: chosenShipmentPrice,
        total: totalPrice,
      },
    };

    httpService.makeOrder(orderDetails).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      storeService.clearUserCartState();
      window.location = res.redirectUri;
    });
  };

  const handleValidate = (values) => {
    const errors = {};

    if (!values.shipmentType) {
      errors.shipmentType = translations.errorUnchosenShipmentType;
    }
    // TODO: [DX] rather move to ParcelShipment component (and expose function), because "it should know" best how to validate itself
    else if (values.shipmentType === 'parcelLocker') {
      const parcelLockerAddress = values.receiver?.address?.parcelLocker;

      if (
        parcelLockerAddress &&
        (!Array.isArray(parcelLockerAddress.location) ||
          parcelLockerAddress.location.length === 0 ||
          parcelLockerAddress.name === '')
      ) {
        errors.receiver = {
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
          <PEVHeading level={3} className="summary__heading">
            {translations.summaryHeading}
          </PEVHeading>

          <TableContainer elevation={0} className="summary__table-container">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {translations.productsValue}
                  </TableCell>
                  <TableCell>{getPresentedPrice(storeService.userCartTotalPrice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {translations.shipmentValue}
                  </TableCell>
                  <TableCell>{getPresentedPrice(chosenShipmentPrice)}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter className="summary__total-value">
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>{translations.totalValue}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{getPresentedPrice(totalPrice)}</strong>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </PEVForm>

      <PEVButton
        className="order__form-submit-btn"
        variant="contained"
        color="primary"
        startIcon={<ShopIcon />}
        form="order-form"
        type="submit"
      >
        {translations.makeOrder}
      </PEVButton>
    </article>
  );
}
