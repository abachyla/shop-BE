import {getProductsList} from './getProductsList';

const products = [{
    count: 5,
    description: 'Description 1',
    id: '1',
    price: 10,
    title: 'Product 1'
}, {
    count: 2,
    description: 'Description 2',
    id: '2',
    price: 15,
    title: 'Product 2'
}];

jest.mock('../mocks/products.json', () => products);

describe('getProductsList', () => {
    it('should return a list of products', async () => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(products),
        };

        expect(await getProductsList()).toEqual(response);
    });

    it('should return 500 error if any errors', async () => {
        const response = {
            statusCode: 500,
            message: 'Something went wrong',
        };
        JSON.stringify = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        });

        expect(await getProductsList()).toEqual(response);
    });
});