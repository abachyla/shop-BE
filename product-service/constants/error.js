import { RESPONSE_STATUSES } from './response';

export const ERROR_TYPES = {
  NOT_FOUND: 'NOT_FOUND',
  DEFAULT: 'DEFAULT',
  NO_ID: 'NO_ID',
};

export const ERRORS = {
  [ERROR_TYPES.NOT_FOUND]: {
    code: RESPONSE_STATUSES.NOT_FOUND,
    message: 'Product is not found.',
  },
  [ERROR_TYPES.DEFAULT]: {
    code: RESPONSE_STATUSES.SERVER_ERROR,
    message: 'Something went wrong.',
  },
  [ERROR_TYPES.NO_ID]: {
    code: RESPONSE_STATUSES.SERVER_ERROR,
    message: 'Product ID is not provided.',
  },
};
