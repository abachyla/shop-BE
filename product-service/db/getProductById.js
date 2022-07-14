import { createClient } from './client';
import { LIST_OF_PRODUCTS } from '../constants/query';

export const GET_PRODUCT_BY_ID = `${LIST_OF_PRODUCTS} WHERE p.id = $1`;

export const getProductById = async (id) => {
  let client;

  try {
    client = await createClient();
    const result = await client.query(GET_PRODUCT_BY_ID, [id]);

    return result.rows.length ? result.rows[0] : null;
  } finally {
    if (client) {
      client.end();
    }
  }
};
