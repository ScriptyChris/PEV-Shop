const MODELS = {
  product: require('./_product'),
  user: require('./_user'),
};

module.exports = (modelType) => {
  // TODO: improve validation
  if (typeof modelType !== 'string') {
    return null;
  }

  return MODELS[modelType.toLowerCase()] || null;
};
