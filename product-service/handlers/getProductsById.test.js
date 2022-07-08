import {getProductsById} from './getProductsById';

const products = [{
    count: 5,
    description: 'Description 1',
    id: '1',
    price: 10,
    title: 'Product 1'
}];

jest.mock('../mocks/products.json', () => products);

describe('getProductsById', () => {
    let event;

    beforeEach(() => {
        event = {
            pathParameters: {}
        };
    });

    it('should return a product by id', async () => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(products[0]),
        };
        event.pathParameters.productId = '1';

        expect(await getProductsById(event)).toEqual(response);
    });

    it('should return 404 error if product is not found by id', async () => {
        const response = {
            statusCode: 404,
            message: 'Product is not found',
        };
        event.pathParameters.productId = '2';

        expect(await getProductsById(event)).toEqual(response);
    });

    it('should return 500 error if id is not provided', async () => {
        const response = {
            statusCode: 500,
            message: 'Id is not provided',
        };

        expect(await getProductsById(event)).toEqual(response);
    });

    it('should return 500 error if event is not provided', async () => {
        const response = {
            statusCode: 500,
            message: 'Id is not provided',
        };

        expect(await getProductsById()).toEqual(response);
    });

    it('should return 500 error if any errors', async () => {
        const response = {
            statusCode: 500,
            message: 'Something went wrong',
        };
        event.pathParameters.productId = '1';
        JSON.stringify = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        });

        expect(await getProductsById(event)).toEqual(response);
    });
});