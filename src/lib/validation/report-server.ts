/* eslint-disable no-magic-numbers */
import { object, string, number } from 'yup';
import { maxLenErrMsg, requiredErrMsg } from './validation-message';

export const reportServerSchema = object({
  description: string()
    .required(requiredErrMsg('Description'))
    .max(255, maxLenErrMsg(255)),
  reportTo: number()
    .required(requiredErrMsg('Report To'))
    .test('Is-Positive', 'Id must be positive integer', (value) => value > 0),
  reportBy: number()
    .required(requiredErrMsg('Report By'))
    .test('Is-Positive?', 'Id must be positive integer', (value) => value > 0),
});
