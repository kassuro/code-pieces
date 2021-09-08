import { ValidationError } from 'yup';
import { ErrorBag } from './types';

export const parseErrors = (errorObj: ValidationError): ErrorBag => {
  return errorObj.inner.reduce((prev, curr) => {
    if (curr.path !== undefined) {
      return {
        ...prev,
        [curr.path]: curr.errors[0],
      };
    }
    return prev;
  }, <ErrorBag>{});
};
