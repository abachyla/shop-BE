import products from '../mocks/products.json';
import { ERRORS, ERROR_TYPES } from '../constants/error';
import { RESPONSE_STATUSES } from '../constants/response';
import { getResponse } from '../helpers/response';

export const getProducts = () => new Promise((resolve) => {
  resolve(products);
});

export const getProductsList = async () => {
  let response;

  try {
    const list = await getProducts();

    response = getResponse(RESPONSE_STATUSES.OK, list);
  } catch {
    const error = ERRORS[ERROR_TYPES.DEFAULT];

    response = getResponse(error.code, error);
  }

  return response;
};
