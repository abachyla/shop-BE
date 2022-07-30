import { Client } from 'pg';
import { SNS } from 'aws-sdk';
import { catalogBatchProcess } from '../handlers/catalogBatchProcess';
import { INSERT_PRODUCT_QUERY } from '../db/insertProduct';
import { RESPONSE_HEADERS, RESPONSE_STATUSES } from '../constants/response';
import { ERROR_TYPES, ERRORS } from '../constants/error';

jest.mock('aws-sdk', () => {
  const mockedSNS = {
    publish: jest.fn(),
  };

  return {
    SNS: jest.fn(() => mockedSNS),
  };
});

jest.mock('pg', () => {
  const client = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => client) };
});

describe('catalogBatchProcess', () => {
  let event;

  beforeEach(() => {
    event = {
      Records: [],
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

  it('should insert products to DB and notify about added products', async () => {
    const product1 = {
      title: 'Product A',
      description: 'Description',
      price: 42,
      count: 34,
    };
    const product2 = {
      title: 'Product B',
      description: 'Description',
      price: 42,
      count: 34,
    };
    const expectedResponseBody = [product1, product2].map((item) => ({ ...item, id: 'product-id' }));
    event.Records = [product1, product2].map((item) => ({ body: JSON.stringify(item) }));

    const response = await catalogBatchProcess(event);

    expect(Client().query).toHaveBeenCalledTimes(8);
    expect(SNS().publish).toHaveBeenCalledTimes(2);
    expect(response.statusCode).toEqual(RESPONSE_STATUSES.OK);
    expect(JSON.parse(response.body)).toEqual(expectedResponseBody);
  });

  it('should not create and notify about products with invalid schema', async () => {
    const product1 = {
      title: 'Product A',
      description: 'Description',
      price: -5,
      count: 34,
    };
    const product2 = {
      title: 'Product B',
      description: 'Description',
      price: 42,
      count: 34,
    };
    const expectedResponseBody = [{ ...product2, id: 'product-id' }];
    event.Records = [product1, product2].map((item) => ({ body: JSON.stringify(item) }));

    const response = await catalogBatchProcess(event);

    expect(Client().query).toHaveBeenCalledTimes(4);
    expect(SNS().publish).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.body)).toEqual(expectedResponseBody);
  });

  it('should return error if there are no input records', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.NO_RECORDS]),
    };

    expect(await catalogBatchProcess(event)).toEqual(expectedResponse);
  });

  it('should return error if there are no input records', async () => {
    const expectedResponse = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.NO_RECORDS]),
    };

    expect(await catalogBatchProcess(event)).toEqual(expectedResponse);
  });
});
