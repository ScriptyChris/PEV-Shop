const MODELS = {
  Product: require('./_product'),
  User: require('./_user'),
  UserRole: require('./_userRole'),
};

module.exports = (modelType) => {
  // TODO: improve validation
  if (typeof modelType !== 'string') {
    return null;
  }

  return MODELS[modelType] || null;
};
