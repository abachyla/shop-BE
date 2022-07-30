import AWS from 'aws-sdk';

const { AWS_REGION, SNS_ARN } = process.env;

const EXPENSIVE_MIN_PRICE = 100;

export const publish = async (product) => {
  const sns = new AWS.SNS({ region: AWS_REGION });

  try {
    console.log('Publish notification.');

    await sns.publish({
      Subject: 'New product was added.',
      Message: JSON.stringify(product),
      TopicArn: SNS_ARN,
      MessageAttributes: {
        expensive: {
          DataType: 'String',
          StringValue: Boolean(product.price > EXPENSIVE_MIN_PRICE).toString(),
        },
      },
    }).promise();

    console.log('Notification was sent.');
  } catch (err) {
    console.log('Notification was not sent.');
    console.log(err);
  }
};
