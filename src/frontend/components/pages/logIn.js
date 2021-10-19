import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import appStore, { USER_SESSION_STATES } from '../../features/appStore';
import apiService from '../../features/apiService';

const translations = Object.freeze({
  logInHeader: 'Login to shop',
  logInField: 'Login',
  passwordField: 'Password',
  submitLogIn: 'Login!',
});

export default function LogIn() {
  const [userLogin, setUserLogin] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loggedInUserData, setLoggedInUserData] = useState(null);

  const onInputChange = ({ target }) => {
    if (target.id === 'login') {
      setUserLogin(target.value);
    } else if (target.id === 'password') {
      setUserPassword(target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.warn('userLogin:', userLogin, ' /userPassword:', userPassword);

    apiService.loginUser({ login: userLogin, password: userPassword }).then((res) => {
      console.log('login res: ', res);

      setLoggedInUserData(res);
      appStore.updateUserSessionState(USER_SESSION_STATES.LOGGED_IN);
    });
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>
            <h2>{translations.logInHeader}</h2>
          </legend>

          <div>
            <label htmlFor="login">{translations.logInField}</label>
            <input id="login" type="text" value={userLogin} onChange={onInputChange} required />
          </div>

          <div>
            <label htmlFor="password">{translations.passwordField}</label>
            <input id="password" type="password" value={userPassword} onChange={onInputChange} required />
          </div>

          <button type="submit">{translations.submitLogIn}</button>
        </fieldset>
      </form>
      {loggedInUserData && (
        <Redirect
          to={{
            pathname: '/account',
            state: { data: loggedInUserData },
          }}
        />
      )}
    </section>
  );
}
