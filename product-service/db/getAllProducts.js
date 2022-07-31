import { createClient } from './client';
import { LIST_OF_PRODUCTS } from '../constants/query';

export const getAllProducts = async () => {
  let client;

  try {
    client = await createClient();
    const result = await client.query(LIST_OF_PRODUCTS);

    return result;
  } finally {
    if (client) {
      client.end();
    }
  }
};
