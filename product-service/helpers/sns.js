import AWS from 'aws-sdk';
const { AWS_REGION, SNS_ARN } = process.env;

export const publish = async (product) => {
  const sns = new AWS.SNS({region: AWS_REGION});

  await sns.publish({
      Subject: 'New product was added.',
      Message: JSON.stringify(product),
      TopicArn: SNS_ARN,
      MessageAttributes: {
          bigPrice: {
              DataType: String,
              StringValue: Boolean(product.price > 100).toString(),
          }
      }
  }).promise();
};