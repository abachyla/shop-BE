import { Client } from 'pg';
import { getProductsById } from '../handlers/getProductsById';
import { ERROR_TYPES, ERRORS } from '../constants/error';
import { RESPONSE_HEADERS, RESPONSE_STATUSES } from '../constants/response';
import { getProductsList } from '../handlers/getProductsList';

const products = [{
  count: 5,
  description: 'Description 1',
  id: '1',
  price: 10,
  title: 'Product 1',
}];

jest.mock('pg', () => {
  const client = {
    connect: jest.fn(),
    query: jest.fn(() => Promise.resolve({ rows: products })),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => client) };
});

describe('getProductsById', () => {
  let event;

  beforeEach(() => {
    event = {
      pathParameters: {},
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a product by id', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.OK,
      body: JSON.stringify(products[0]),
    };
    event.pathParameters.productId = '1';

    expect(await getProductsById(event)).toEqual(expectedResponse);
  });

  it('should return 404 error if product is not found by id', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.NOT_FOUND,
      body: JSON.stringify(ERRORS[ERROR_TYPES.NOT_FOUND]),
    };
    event.pathParameters.productId = '2';
    jest.spyOn(Client(), 'query').mockImplementation(() => Promise.resolve({ rows: [] }));

    expect(await getProductsById(event)).toEqual(expectedResponse);
  });

  it('should return 500 error if id is not provided', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.NO_ID]),
    };

    expect(await getProductsById(event)).toEqual(expectedResponse);
  });

  it('should return 500 error if event is not provided', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.NO_ID]),
    };

    expect(await getProductsById()).toEqual(expectedResponse);
  });

  it('should return 500 error with thrown message if error message exists', async () => {
    const message = 'Connect error';
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify({ code: RESPONSE_STATUSES.SERVER_ERROR, message }),
    };
    jest.spyOn(Client(), 'connect').mockImplementation(() => Promise.reject(new Error(message)));
    event.pathParameters.productId = '1';

    expect(await getProductsById(event)).toEqual(expectedResponse);
  });

  it('should return 500 error with default message if error message does not exist', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.DEFAULT]),
    };
    jest.spyOn(Client(), 'connect').mockImplementation(() => Promise.reject());

    expect(await getProductsList(event)).toEqual(expectedResponse);
  });
});
