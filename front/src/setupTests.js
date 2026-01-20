import '@testing-library/jest-dom';

jest.mock('axios', () => {
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };

  mockAxios.create = () => mockAxios;

  return mockAxios;
});
