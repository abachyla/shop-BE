import { ERRORS, ERROR_TYPES } from '../constants/error';
import { RESPONSE_STATUSES } from '../constants/response';
import { getResponse } from '../helpers/response';
import { getProductById } from '../db/getProductById';

export const getProductsById = async (event = {}) => {
  let response;

  console.log('getProductsById');
  console.log(event);

  try {
    const id = event.pathParameters && event.pathParameters.productId;

    if (!id) { throw new Error(ERROR_TYPES.NO_ID); }

    const product = await getProductById(id);

    console.log('Result');
    console.log(product);

    if (!product) { throw new Error(ERROR_TYPES.NOT_FOUND); }

    response = getResponse(RESPONSE_STATUSES.OK, product);
  } catch (err) {
    console.log(err);

    const error = ERRORS[err && err.message] || ERRORS[ERROR_TYPES.DEFAULT];

    response = getResponse(error.code, error);
  }

  return response;
};
