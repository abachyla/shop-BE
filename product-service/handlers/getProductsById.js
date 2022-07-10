import products from '../mocks/products.json';
import { ERRORS, ERROR_TYPES } from '../constants/error';
import { RESPONSE_HEADERS, RESPONSE_STATUSES } from '../constants/response';

const getProduct = (id = '') => new Promise((resolve, reject) => {
  if (!id) {
    reject(ERROR_TYPES.NO_ID);
  }

  const product = products.find((item) => item.id === id);

  if (product) {
    resolve(product);
  } else {
    reject(ERROR_TYPES.NOT_FOUND);
  }
});

export const getProductsById = async (event = {}) => {
  const response = {
    headers: RESPONSE_HEADERS,
  };

  try {
    const id = event.pathParameters && event.pathParameters.productId;
    const product = await getProduct(id);

    response.statusCode = RESPONSE_STATUSES.OK;
    response.body = JSON.stringify(product);
  } catch (err) {
    const error = ERRORS[err] || ERRORS[ERROR_TYPES.DEFAULT];

    response.statusCode = error.code;
    response.body = JSON.stringify(error);
  }

  return response;
};
