import { Client } from 'pg';
import { createProduct } from '../handlers/createProduct';
import { ERROR_TYPES, ERRORS } from '../constants/error';
import { RESPONSE_HEADERS, RESPONSE_STATUSES } from '../constants/response';
import { INSERT_PRODUCT_QUERY } from '../db/insertProduct';

jest.mock('pg', () => {
  const client = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => client) };
});

describe('createProduct', () => {
  let event;

  beforeEach(() => {
    event = {
      body: '',
    };

    jest.spyOn(Client(), 'query').mockImplementation((query) => {
      const res = {
        rows: [{ id: query === INSERT_PRODUCT_QUERY ? 'product-id' : '' }],
      };

      return Promise.resolve(res);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a product and return it', async () => {
    const product = {
      title: 'Product A', description: 'Description', price: 42, count: 34,
    };
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.CREATED,
      body: JSON.stringify({ id: 'product-id', ...product }),
    };
    event.body = JSON.stringify(product);

    expect(await createProduct(event)).toEqual(expectedResponse);
  });

  it('should return 400 error if product title is not provided', async () => {
    const product = { price: 42, count: 34 };
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.BAD_REQUEST,
      body: JSON.stringify(ERRORS[ERROR_TYPES.PRODUCT_VALIDATION]),
    };
    event.body = JSON.stringify(product);

    expect(await createProduct(event)).toEqual(expectedResponse);
  });

  it('should return 400 error if product price is not provided', async () => {
    const product = { title: 'Product A', count: 34 };
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.BAD_REQUEST,
      body: JSON.stringify(ERRORS[ERROR_TYPES.PRODUCT_VALIDATION]),
    };
    event.body = JSON.stringify(product);

    expect(await createProduct(event)).toEqual(expectedResponse);
  });

  it('should return 400 error if product count is not provided', async () => {
    const product = { title: 'Product A', price: 42 };
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.BAD_REQUEST,
      body: JSON.stringify(ERRORS[ERROR_TYPES.PRODUCT_VALIDATION]),
    };
    event.body = JSON.stringify(product);

    expect(await createProduct(event)).toEqual(expectedResponse);
  });

  it('should return 400 error if product price is less than 0', async () => {
    const product = { title: 'Product A', price: -1, count: 42 };
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.BAD_REQUEST,
      body: JSON.stringify(ERRORS[ERROR_TYPES.PRODUCT_VALIDATION]),
    };
    event.body = JSON.stringify(product);

    expect(await createProduct(event)).toEqual(expectedResponse);
  });

  it('should return 400 error if product count is less than 0', async () => {
    const product = { title: 'Product A', price: 42, count: -1 };
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.BAD_REQUEST,
      body: JSON.stringify(ERRORS[ERROR_TYPES.PRODUCT_VALIDATION]),
    };
    event.body = JSON.stringify(product);

    expect(await createProduct(event)).toEqual(expectedResponse);
  });

  it('should return 500 error if body is not parsed', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.DEFAULT]),
    };
    event.body = '{a}';

    expect(await createProduct(event)).toEqual(expectedResponse);
  });

  it('should return 500 error if event is not provided', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.DEFAULT]),
    };

    expect(await createProduct()).toEqual(expectedResponse);
  });

  it('should return 500 error with default message if an error was thrown', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.DEFAULT]),
    };
    jest.spyOn(Client(), 'connect').mockImplementation(() => Promise.reject());
    event.body = JSON.stringify({ title: 'Product', price: 42, count: 34 });

    expect(await createProduct(event)).toEqual(expectedResponse);
  });
});
