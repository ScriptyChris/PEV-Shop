import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import apiService from '../../features/apiService';
import { startSession } from '../../features/userSessionAPI';

const translations = Object.freeze({
  logInHeader: 'Login to shop',
  logInField: 'Login',
  passwordField: 'Password',
  submitLogIn: 'Login!',
  resetPasswordHint: `Don't remember password?`,
  resetPasswordLink: 'Reset it!',
});

export default function LogIn() {
  const [userLogin, setUserLogin] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const history = useHistory();

  const onInputChange = ({ target }) => {
    if (target.id === 'login') {
      setUserLogin(target.value);
    } else if (target.id === 'password') {
      setUserPassword(target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    apiService.loginUser({ login: userLogin, password: userPassword }).then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      startSession(res);

      /*
        TODO: [UX] redirect to the page where user was before logging in 
        OR just close/fold the form, if it is presented as a aside/sticky panel
      */
      history.push('/');
    });
  };

  return (
    <section>
      {/* TODO: [REFACTOR] use <Formik /> */}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>
            <h2>{translations.logInHeader}</h2>
          </legend>

          <div>
            <label htmlFor="login">{translations.logInField}</label>
            <input id="login" type="text" value={userLogin} onChange={onInputChange} required />
          </div>

          {/* TODO: [REFACTOR] use `recoverAccount.PasswordField` component */}
          <div>
            <label htmlFor="password">{translations.passwordField}</label>
            <input
              id="password"
              type="password"
              value={userPassword}
              onChange={onInputChange}
              minLength="8"
              maxLength="20"
              required
            />
          </div>

          <button type="submit">{translations.submitLogIn}</button>
        </fieldset>
      </form>

      <div>
        <p>{translations.resetPasswordHint}</p>
        <Link to={'/reset-password'}>{translations.resetPasswordLink}</Link>
      </div>

      {/* TODO: [UX] if User account is not confirmed, show an info with hint to re-send activation email */}
      {/* TODO: [UX] if User credentials are invalid, show regarding info instead of redirecting to /account  */}
    </section>
  );
}
