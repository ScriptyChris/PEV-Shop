const MODELS = {
  Product: require('./_product'),
  User: require('./_user'),
  'User-Role': require('./_userRole'),
};

module.exports = (modelType) => {
  // TODO: improve validation
  if (typeof modelType !== 'string') {
    return null;
  }

  return MODELS[modelType] || null;
};
