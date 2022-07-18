import { ERRORS, ERROR_TYPES } from '../constants/error';
import { RESPONSE_STATUSES } from '../constants/response';
import { getResponse } from '../helpers/response';
import { getAllProducts } from '../db/getAllProducts';

export const getProductsList = async (event) => {
  let response;

  console.log('getProductsList');
  console.log(event);

  try {
    const result = await getAllProducts();

    console.log('Result');
    console.log(result);

    response = getResponse(RESPONSE_STATUSES.OK, result.rows);
  } catch (err) {
    console.log(err);

    const error = ERRORS[ERROR_TYPES.DEFAULT];

    response = getResponse(error.code, error);
  }

  return response;
};
