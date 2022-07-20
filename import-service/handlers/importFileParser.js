import { importFile } from '../helpers/s3';
import { getResponse } from '../helpers/response';
import { RESPONSE_STATUSES } from '../constants/response';
import { ERROR_TYPES, ERRORS } from '../constants/error';

export const importFileParser = async (event) => {
  let response;

  console.log('importFileParser');
  console.log(event);

  try {
    const records = event.Records || [];

    if (!records.length) {
      throw new Error(ERROR_TYPES.NO_RECORDS);
    }

    await Promise.all(records.map(importFile));

    response = getResponse(RESPONSE_STATUSES.ACCEPTED);
  } catch (err) {
    console.log('Import Error');
    console.log(err);

    const error = ERRORS[ERROR_TYPES.DEFAULT];
    response = getResponse(error.code, error);
  }

  return response;
};
