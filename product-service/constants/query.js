export const LIST_OF_PRODUCTS = 'SELECT p.id, p.title, p.description, p.price, s.count FROM products AS p JOIN stocks AS s ON p.id = s.product_id';
