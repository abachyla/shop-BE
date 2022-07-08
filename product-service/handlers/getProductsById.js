import products from '../mocks/products.json';

const getProduct = (productId) => new Promise((resolve, reject) => {
    const product = products.find((item) => item.id === productId);

    if (product) {
        resolve(product);
    } else {
        reject({
            statusCode: 404,
            message: "Product is not found",
        });
    }
})

export const getProductsById = async (event = {}) => {
    let response = {};

    try {
        const id = event.pathParameters && event.pathParameters.productId;

        if (!id) {
            throw {statusCode: 500, message: 'id is not provided'}
        }

        const product = await getProduct(id);

        response = {
            statusCode: 200,
            body: JSON.stringify(product),
        }
    } catch (error) {
        response = error || {
            statusCode: 500,
            message: 'Something went wrong'
        };
    }

    return response;
};
