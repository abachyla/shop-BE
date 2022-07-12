import products from '../mocks/products.json';
import { ERRORS, ERROR_TYPES } from '../constants/error';
import { RESPONSE_STATUSES } from '../constants/response';
import { getResponse } from '../helpers/response';

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
  let response;

  try {
    const id = event.pathParameters && event.pathParameters.productId;
    const product = await getProduct(id);

    response = getResponse(RESPONSE_STATUSES.OK, product);
  } catch (err) {
    const error = ERRORS[err] || ERRORS[ERROR_TYPES.DEFAULT];

    response = getResponse(error.code, error);
  }

  return response;
};
