import { createClient } from './client';
import { LIST_OF_PRODUCTS } from '../constants/query';

export const CREATE_PRODUCT = (product) => `BEGIN;
      with product as (INSERT INTO products (title, description, price) VALUES ('${product.title}', '${product.description}', ${product.price}) returning *),
      stock as (insert into stocks (product_id, count) select (select id from product), ${product.count} as count returning *)
      ${LIST_OF_PRODUCTS}
      COMMIT;
      `;

export const insertProduct = async (product) => {
  let client;

  try {
    client = await createClient();

    const products = await client.query(CREATE_PRODUCT(product));

    return products;
  } finally {
    if (client) {
      client.end();
    }
  }
};
