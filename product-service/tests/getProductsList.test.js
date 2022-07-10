import { getProductsList } from '../handlers/getProductsList';
import { RESPONSE_HEADERS, RESPONSE_STATUSES } from '../constants/response';

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

jest.mock('../mocks/products.json', () => products);

describe('getProductsList', () => {
  it('should return a list of products', async () => {
    const response = {
      headers: RESPONSE_HEADERS,
      statusCode: RESPONSE_STATUSES.OK,
      body: JSON.stringify(products),
    };

    expect(await getProductsList()).toEqual(response);
  });

  it('should return 500 error if any errors', async () => {
    JSON.stringify = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await getProductsList();

    expect(response.statusCode).toBe(RESPONSE_STATUSES.SERVER_ERROR);
  });
});
