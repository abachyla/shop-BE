import S3 from 'aws-sdk/clients/s3';
import { importProductsFile } from '../handlers/importProductsFile';
import { RESPONSE_HEADERS, RESPONSE_STATUSES } from '../constants/response';
import { ERROR_TYPES, ERRORS } from '../constants/error';

/* aws-sdk-mock was not used due the issue https://github.com/dwyl/aws-sdk-mock/issues/197 */
jest.mock('aws-sdk/clients/s3', () => {
  class MockedS3 {
    getSignedUrlPromise() {}
  }

  return MockedS3;
});

describe('importProductsFile', () => {
  let event;

  beforeEach(() => {
    event = {
      queryStringParameters: {
        name: 'default',
      },
    };
  });

  it('should return signed url', async () => {
    const url = 'signed-url';
    const expectedResponse = {
      statusCode: RESPONSE_STATUSES.OK,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify(url),
    };
    jest.spyOn(S3.prototype, 'getSignedUrlPromise').mockImplementation(() => Promise.resolve(url));

    expect(await importProductsFile(event)).toEqual(expectedResponse);
  });

  it('should return error if signed url was not generated', async () => {
    const expectedResponse = {
      statusCode: RESPONSE_STATUSES.SERVER_ERROR,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify(ERRORS[ERROR_TYPES.DEFAULT]),
    };
    jest.spyOn(S3.prototype, 'getSignedUrlPromise').mockImplementation(() => Promise.reject(new Error('Error')));

    expect(await importProductsFile(event)).toEqual(expectedResponse);
  });
});
