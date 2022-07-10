import products from '../mocks/products.json';
import { ERRORS, ERROR_TYPES } from '../constants/error';
import { RESPONSE_HEADERS, RESPONSE_STATUSES } from '../constants/response';

const getProducts = () => new Promise((resolve) => {
  resolve(products);
});

export const getProductsList = async () => {
  const response = {
    headers: RESPONSE_HEADERS,
  };

  try {
    const list = await getProducts();

    response.statusCode = RESPONSE_STATUSES.OK;
    response.body = JSON.stringify(list);
  } catch {
    const error = ERRORS[ERROR_TYPES.DEFAULT];

    response.statusCode = error.code;
    response.body = JSON.stringify(error);
  }

  return response;
};
