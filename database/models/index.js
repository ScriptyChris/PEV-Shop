const MODELS = {
  product: require('./_product'),
};

module.exports = (modelType) => {
  // TODO: improve validation
  if (typeof modelType !== 'string') {
    return null;
  }

  return MODELS[modelType.toLowerCase()] || null;
};
