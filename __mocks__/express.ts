import { TJestMock } from '../src/types';

const router: Partial<{ get: TJestMock; post: TJestMock; patch: TJestMock }> = Object.defineProperties(
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
    delete: {
      value: jest.fn(),
      writable: false,
    },
    use: {
      value: jest.fn(),
      writable: false,
    },
  }
);

const express: TJestMock & Partial<{ Router: TJestMock; _router: typeof router; json: typeof jest.fn }> = jest.fn();
express.Router = jest.fn(() => router);
express._router = router;
express.json = jest.fn();

module.exports = express;
