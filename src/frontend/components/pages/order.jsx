import React, { memo, useState, useEffect } from 'react';
import storeService from '../../features/storeService';
import httpService from '../../features/httpService';

const translations = Object.freeze({
  payForOrder: 'Pay!',
});

const Shipment = memo(function Shipment({ updateChosenShipmentPoint }) {
  useEffect(() => {
    function onShipmentMapMessage(event) {
      if (event.data?.sender === 'shipment-map' && event.origin === window.location.origin) {
        console.log('(onShipmentMapMessage) event.data:', event.data);

        const { address, name } = event.data.point;

        updateChosenShipmentPoint({
          address: Object.values(address),
          name,
        });
      }
    }

    window.addEventListener('message', onShipmentMapMessage);

    return () => {
      window.removeEventListener('message', onShipmentMapMessage);
    };
  }, []);

  return <iframe src="/embedded/shipment-map.html" style={{ width: '100%', minHeight: '75%' }}></iframe>;
});

export default function Order() {
  const [chosenShipmentPoint, setChosenShipmentPoint] = useState(null);
  const payForOrder = () => {
    httpService.makeOrder(storeService.userCartProducts).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      storeService.clearUserCartState();
      window.location = res.redirectUri;
    });
  };

  useEffect(() => {
    console.log('chosenShipmentPoint:', chosenShipmentPoint);
  }, [chosenShipmentPoint]);

  return (
    <>
      <Shipment updateChosenShipmentPoint={setChosenShipmentPoint} />
      <button onClick={payForOrder}>{translations.payForOrder}</button>
    </>
  );
}
