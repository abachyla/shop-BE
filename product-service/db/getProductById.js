import { createClient } from './client';
import { LIST_OF_PRODUCTS } from '../constants/query';

export const GET_PRODUCT_BY_ID = (id) => `${LIST_OF_PRODUCTS} WHERE p.id = '${id}'`;

export const getProductById = async (id) => {
  let client;

  try {
    client = await createClient();
    const result = await client.query(GET_PRODUCT_BY_ID(id));
    const product = result.rows.length ? result.rows[0] : null;

    return product;
  } finally {
    if (client) {
      client.end();
    }
  }
};
