import { APIGatewayTokenAuthorizerHandler, APIGatewayAuthorizerResult } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

enum Effect {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  console.log('Basic Authorizer');
  console.log(event);

  const {authorizationToken = '', methodArn} = event;

  if (event.type !== 'TOKEN') {
    return generatePolicy(authorizationToken, methodArn, Effect.DENY);
  }

  try {
    const userCreds = getUserCredentialsFromToken(authorizationToken);
    const password = process.env[userCreds.username];
    const effect = password && password === userCreds.password ? Effect.ALLOW : Effect.DENY;

    return generatePolicy(authorizationToken, methodArn, effect);
  } catch(error) {
    return generatePolicy(authorizationToken, methodArn, Effect.DENY);
  }
};

function getUserCredentialsFromToken(token: string) {
  const encodedCreds = token.split(' ')[1];
  const buff = Buffer.from(encodedCreds, 'base64');
  const creds = buff.toString('utf-8').split(':');

  return {
    username: creds[0],
    password: creds[1],
  }
}

function generatePolicy(principalId, resource, effect = Effect.ALLOW): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ]
    }
  }
}

export const main = middyfy(basicAuthorizer);
