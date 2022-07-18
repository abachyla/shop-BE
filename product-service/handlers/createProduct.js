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
    const { body = '' } = event;
    const data = JSON.parse(body);

    const errors = validateProduct(data);
    if (errors) {
      console.log('Product validation error');
      console.log(errors);

      throw new Error(ERROR_TYPES.PRODUCT_VALIDATION);
    }

    const product = await insertProduct(data);

    console.log('Result');
    console.log(product);

    response = getResponse(RESPONSE_STATUSES.OK, product);
  } catch (err) {
    console.log(err);

    const error = ERRORS[err && err.message] || ERRORS[ERROR_TYPES.DEFAULT];

    response = getResponse(error.code, error);
  }

  return response;
};
