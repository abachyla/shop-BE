import products from '../mocks/products.json';
import {ERRORS, ERROR_TYPES} from '../constants/error';
import {RESPONSE_STATUSES} from "../constants/response";

const getProducts = () => new Promise((resolve) => {
    resolve(products);
});

export const getProductsList = async () => {
    let response;

    try {
        const list = await getProducts();

        response = {
            statusCode: RESPONSE_STATUSES.OK,
            body: JSON.stringify(list),
        }
    } catch {
        const error = ERRORS[ERROR_TYPES.DEFAULT];

        response = {
            statusCode: error.code,
            body: JSON.stringify(error),
        }
    }

    return response;
};
