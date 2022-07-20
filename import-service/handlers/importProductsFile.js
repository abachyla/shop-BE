import { getResponse } from '../helpers/response';
import { getSignedUrl } from '../helpers/s3';
import { RESPONSE_STATUSES } from '../constants/response';
import { ERROR_TYPES, ERRORS } from '../constants/error';

export const importProductsFile = async (event = {}) => {
  let response;

  console.log('importProductsFile');
  console.log(event);

  try {
    const { name = '' } = event.queryStringParameters;
    const signedUrl = await getSignedUrl(name);

    console.log('Result');
    console.log(signedUrl);

    response = getResponse(RESPONSE_STATUSES.OK, signedUrl);
  } catch (err) {
    console.log(err);

    const error = ERRORS[ERROR_TYPES.DEFAULT];
    response = getResponse(error.code, error);
  }

  return response;
};
