import { ERROR_TYPES, ERRORS } from '../constants/error';
import { getResponse } from '../helpers/response';
import { insertProduct } from '../db/insertProduct';
import { RESPONSE_STATUSES } from '../constants/response';
import { publish } from '../helpers/sns';

export const catalogBatchProcess = async (event = {}) => {
  let response;
  console.log('catalogBatchProcess');
  console.log(event);

  try {
    const records = event.Records || [];

    if (!records.length) {
      throw new Error(ERROR_TYPES.NO_RECORDS);
    }

    console.log(records);

    const products = await Promise.all(records.map(async (record) => {
      try {
        const product = await insertProduct(record);

        console.log('Product was created.');
        console.log(product);

        await publish(product);

        return product;
      } catch (err) {
        console.log('Product was not created.');
        console.log(err);

        return null;
      }
    }));
    const createdProducts = products.filter((item) => item);

    response = getResponse(RESPONSE_STATUSES.OK, createdProducts);
  } catch (err) {
    console.log(err);

    const error = ERRORS[err && err.message] || ERRORS[ERROR_TYPES.DEFAULT];

    response = getResponse(error.code, error);
  }

  return response;
};
