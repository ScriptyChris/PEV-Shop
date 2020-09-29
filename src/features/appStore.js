import { observable, decorate, action } from 'mobx';

const USER_SESSION_STATES = Object.freeze({
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
});

class AppStore {
  constructor() {
    this.userSessionStates = USER_SESSION_STATES.LOGGED_OUT;
  }

  updateUserSessionState(userSessionState) {
    this.userSessionStates = userSessionState;
  }
}

decorate(AppStore, {
  userSessionStates: observable,
  updateUserSessionState: action,
});

const appStore = new AppStore();

export { USER_SESSION_STATES };

export default appStore;
