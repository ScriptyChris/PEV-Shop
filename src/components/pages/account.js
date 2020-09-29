import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiService from '../../features/apiService';

export default function Account() {
  // TODO: fix rendering component twice when redirected from LogIn page
  const { state: locationState } = useLocation();
  const [userData, setUserData] = useState(null);
  console.warn('Account...state', locationState);

  useEffect(() => {
    if (locationState) {
      setUserData(locationState.data);

      return;
    }

    apiService.getUser().then(
      (result) => setUserData(result),
      (error) => {
        console.log('getUser() error:', error);
      }
    );
  }, []);

  return (
    <section>
      User account!
      <div>{userData ? JSON.stringify(userData) : 'No user data'}</div>
    </section>
  );
}
