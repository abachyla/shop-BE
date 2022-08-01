import { APIGatewayRequestAuthorizerEvent, APIGatewayTokenAuthorizerHandler, AuthResponse } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

enum Effect {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayRequestAuthorizerEvent, _context, cb) => {
  console.log('Basic Authorizer');
  console.log(event);

  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
  }

  try {
    const {authorizationToken = '', methodArn} = event;
    const userCreds = getUserCredentialsFromToken(authorizationToken);
    const user = process.env[userCreds.username];

    const effect = user && user === userCreds.password ? Effect.ALLOW : Effect.DENY;
    const policy = generatePolicy(user.username, methodArn, effect);

    cb(null, policy);

  } catch(error) {
    cb(`Unauthorized: ${error.message}`);
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

function generatePolicy(principalId, resource, effect = Effect.ALLOW): AuthResponse {
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
