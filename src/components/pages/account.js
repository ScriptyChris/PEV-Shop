import React, { useState, useEffect } from 'react';
import apiService from '../../features/apiService';

export default function Account() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    apiService.getUser().then(
      (result) => {
        console.log('result?', result);
        setUserData(result);
      },
      (error) => {
        console.log('err?', error);
      }
    );
  });

  return (
    <div>
      User account!
      {userData ? JSON.stringify(userData) : 'No user data'}
    </div>
  );
}
