import { ERRORS, ERROR_TYPES } from '../constants/error';
import { RESPONSE_STATUSES } from '../constants/response';
import { getResponse } from '../helpers/response';
import { insertProduct } from '../db/insertProduct';
import { validateProduct } from '../helpers/validateProduct';

export const createProduct = async (event = {}) => {
  let response;

  console.log('createProduct');
  console.log(event);

  try {
    const product = await insertProduct(event);

    console.log('Result');
    console.log(product);

    response = getResponse(RESPONSE_STATUSES.CREATED, product);
  } catch (err) {
    console.log(err);

    const error = ERRORS[err && err.message] || ERRORS[ERROR_TYPES.DEFAULT];

    response = getResponse(error.code, error);
  }

  return response;
};
