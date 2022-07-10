import { getProductsById } from '../handlers/getProductsById';
import { ERROR_TYPES, ERRORS } from '../constants/error';
import { RESPONSE_HEADERS, RESPONSE_STATUSES } from '../constants/response';

const products = [{
  count: 5,
  description: 'Description 1',
  id: '1',
  price: 10,
  title: 'Product 1',
}];

jest.mock('../mocks/products.json', () => products);

describe('getProductsById', () => {
  let event;

  beforeEach(() => {
    event = {
      pathParameters: {},
    };
  });

  it('should return a product by id', async () => {
    const response = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.OK,
      body: JSON.stringify(products[0]),
    };
    event.pathParameters.productId = '1';

    expect(await getProductsById(event)).toEqual(response);
  });

  it('should return 404 error if product is not found by id', async () => {
    const response = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.NOT_FOUND,
      body: JSON.stringify(ERRORS[ERROR_TYPES.NOT_FOUND]),
    };
    event.pathParameters.productId = '2';

    expect(await getProductsById(event)).toEqual(response);
  });

  it('should return 500 error if id is not provided', async () => {
    const response = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.NO_ID]),
    };

    expect(await getProductsById(event)).toEqual(response);
  });

  it('should return 500 error if event is not provided', async () => {
    const response = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      body: JSON.stringify(ERRORS[ERROR_TYPES.NO_ID]),
    };

    expect(await getProductsById()).toEqual(response);
  });

  it('should return 500 error if any errors', async () => {
    event.pathParameters.productId = '1';
    JSON.stringify = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await getProductsById(event);

    expect(response.statusCode).toBe(RESPONSE_STATUSES.SERVER_ERROR);
  });
});
