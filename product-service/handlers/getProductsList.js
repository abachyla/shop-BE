import products from '../mocks/products.json';

const getProducts = () => new Promise((resolve) => {
    resolve(products);
});

export const getProductsList = async () => {
    let response = {};

    try {
        const list = await getProducts();

        response = {
            statusCode: 200,
            body: JSON.stringify(list),
        }
    } catch {
        response = {
            statusCode: 500,
            message: 'Something went wrong',
        }
    }

    return response;
};
