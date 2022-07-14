import { createClient } from './client';

export const INSERT_PRODUCT_QUERY = 'INSERT INTO products (title, price, description) VALUES ($1, $2, $3) RETURNING id';
export const INSERT_STOCK_QUERY = 'INSERT INTO stocks (product_id, count) VALUES ($1, $2)';

export const insertProduct = async (product) => {
  let client;

  try {
    client = await createClient();

    await client.query('BEGIN');
    const result = await client.query(
      INSERT_PRODUCT_QUERY,
      [product.title, product.price, product.description || ''],
    );

    console.log('Create product result');
    console.log(result);

    const [entry] = result.rows;
    await client.query(INSERT_STOCK_QUERY, [entry.id, product.count]);
    await client.query('COMMIT');

    return {
      ...entry,
      ...product,
    };
  } finally {
    if (client) {
      client.end();
    }
  }
};
