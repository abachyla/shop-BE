export const getProductsList = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Products list',
                input: event,
            },
            null,
            2
        ),
    };
};
