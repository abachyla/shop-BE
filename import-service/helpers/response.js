import { RESPONSE_STATUSES, RESPONSE_HEADERS } from '../constants/response';

export const getResponse = (statusCode = RESPONSE_STATUSES.OK, data = {}) => ({
  headers: RESPONSE_HEADERS,
  statusCode,
  body: JSON.stringify(data),
});
