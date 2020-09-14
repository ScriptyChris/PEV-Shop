import React, { useState } from 'react';

export default function LogIn() {
  const [loginState, setLoginState] = useState('');
  const [passwordState, setPasswordState] = useState('');

  const onInputChange = ({ target }) => {
    if (target.id === 'login') {
      setLoginState(target.value);
    } else if (target.id === 'password') {
      setPasswordState(target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.warn('loginState', loginState, ' /passwordState', passwordState);
  };

  return (
    <div>
      LogIn!
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Please type your account login and password</legend>

          <label htmlFor="login">Login</label>
          <input id="login" type="text" value={loginState} onChange={onInputChange} />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={passwordState} onChange={onInputChange} />

          <button type="submit">Log in!</button>
        </fieldset>
      </form>
    </div>
  );
}
