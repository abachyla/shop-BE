import { RESPONSE_STATUSES } from './response';

export const ERROR_TYPES = {
  DEFAULT: 'DEFAULT',
  NO_RECORDS: 'NO_RECORDS',
};

export const ERRORS = {
  [ERROR_TYPES.NO_RECORDS]: {
    code: RESPONSE_STATUSES.SERVER_ERROR,
    message: 'No records provided.',
  },
  [ERROR_TYPES.DEFAULT]: {
    code: RESPONSE_STATUSES.SERVER_ERROR,
    message: 'Something went wrong.',
  },
};
