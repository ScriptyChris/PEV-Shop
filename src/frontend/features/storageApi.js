const saveUserCartStateToStorage = (userCartState) => {
  try {
    if (!userCartState || userCartState.toString() !== '[object Object]' || userCartState.totalCount === 0) {
      window.localStorage.removeItem('userCartState');
      return;
    }

    window.localStorage.setItem('userCartState', JSON.stringify(userCartState));
  } catch (error) {
    console.error('saveUserCartStateToStorage error:', error);
  }
};

const getUserCartStateFromStorage = () => {
  try {
    return JSON.parse(window.localStorage.getItem('userCartState'));
  } catch (error) {
    console.error('getUserCartStateFromStorage error:', error, '. Return empty object.');
    return null;
  }
};

export { saveUserCartStateToStorage, getUserCartStateFromStorage };
