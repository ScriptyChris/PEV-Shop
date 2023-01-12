/**
 * Handles HTML `<body>` style changes, which affect position of components,
 * such as `ScrollToTop` button and `ProductComparisonCandidates` bar.
 * @module
 */

type TSubscriptionCallback = {
  subscriptionID: number;
  (bodyStyle: CSSStyleDeclaration): void;
};

let nextMutationSubscriptionID = 0;
const bodyMutationSubscribers: TSubscriptionCallback[] = [];

const bodyObserver = new MutationObserver((mutations) => {
  if (mutations.some((m) => m.attributeName === 'style')) {
    bodyMutationSubscribers.forEach((subscriber) => subscriber(document.body.style));
  }
});
bodyObserver.observe(document.body, { attributes: true });

/**
 * Subscribes a provided `callback` to `<body>` style mutations.
 * @returns subscriptionID, which lets unsubscribing `callback` later.
 */
export const subscribeToBodyMutations = (callback: TSubscriptionCallback) => {
  callback.subscriptionID = nextMutationSubscriptionID++;
  bodyMutationSubscribers.push(callback);

  return callback.subscriptionID;
};

/**
 * Unsubscribes previously subscribed `callback` (via it's ID) from `<body>` style mutations.
 */
export const unSubscribeFromBodyMutations = (subscriptionID: number) => {
  const subscriptionCallbackIndex = bodyMutationSubscribers.findIndex(
    (callback) => callback.subscriptionID === subscriptionID
  );

  if (subscriptionCallbackIndex === -1) {
    throw Error(`Cannot find body mutation subscription callback by "${subscriptionCallbackIndex}" ID!`);
  }

  let subscriptionCallback: TSubscriptionCallback | null = bodyMutationSubscribers.splice(
    subscriptionCallbackIndex,
    1
  )[0];

  // make it easier to garbage collect
  subscriptionCallback = null;
};
