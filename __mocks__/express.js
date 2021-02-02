const router = Object.defineProperties(
  {},
  {
    get: {
      value: jest.fn(),
      writable: false,
    },
    post: {
      value: jest.fn(),
      writable: false,
    },
    patch: {
      value: jest.fn(),
      writable: false,
    },
  }
);
const express = jest.fn();
express.Router = jest.fn(() => router);
express._router = router;

module.exports = express;
