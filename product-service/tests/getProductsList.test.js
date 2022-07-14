import { Client } from 'pg';
import { getProductsList } from '../handlers/getProductsList';
import { RESPONSE_HEADERS, RESPONSE_STATUSES } from '../constants/response';
import { ERROR_TYPES, ERRORS } from '../constants/error';

const products = [{
  count: 5,
  description: 'Description 1',
  id: '1',
  price: 10,
  title: 'Product 1',
}, {
  count: 2,
  description: 'Description 2',
  id: '2',
  price: 15,
  title: 'Product 2',
}];

jest.mock('pg', () => {
  const client = {
    connect: jest.fn(),
    query: jest.fn(() => Promise.resolve({ rows: products })),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => client) };
});

describe('getProductsList', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a list of products', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.OK,
      body: JSON.stringify(products),
    };

    expect(await getProductsList()).toEqual(expectedResponse);
  });

  it('should return 500 error with thrown message if error message exists', async () => {
    const message = 'Connect error';
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify({ code: RESPONSE_STATUSES.SERVER_ERROR, message }),
    };
    jest.spyOn(Client(), 'connect').mockImplementation(() => Promise.reject(new Error(message)));

    expect(await getProductsList()).toEqual(expectedResponse);
  });

  it('should return 500 error with default message if error message does not exist', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.DEFAULT]),
    };
    jest.spyOn(Client(), 'connect').mockImplementation(() => Promise.reject());

    expect(await getProductsList()).toEqual(expectedResponse);
  });
});
