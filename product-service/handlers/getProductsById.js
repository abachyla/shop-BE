export const getProductsById = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Products by ID',
                input: event,
            },
            null,
            2
        ),
    };
};