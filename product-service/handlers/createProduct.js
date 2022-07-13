import { ERRORS, ERROR_TYPES } from '../constants/error';
import { RESPONSE_STATUSES } from '../constants/response';
import { getResponse } from '../helpers/response';
import { insertProduct } from '../db/insertProduct';

export const createProduct = async (event = {}) => {
  let response;

  console.log('createProduct');
  console.log(event);

  try {
    const { body = '' } = event;
    const data = JSON.parse(body); // add validate

    const product = await insertProduct(data);

    console.log('Result');
    console.log(product);

    response = getResponse(RESPONSE_STATUSES.OK, product);
  } catch (err) {
    console.log('Error');
    console.log(err);

    const error = ERRORS[err] || ERRORS[ERROR_TYPES.DEFAULT];

    response = getResponse(error.code, error);
  }

  return response;
};
