/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
import { object, string, mixed } from 'yup';
import { PASSWORD_MAX_LEN, PASSWORD_MIN_LEN } from './validation-format';
import {
  emailErrMsg,
  maxLenErrMsg,
  minLenErrMsg,
  requiredErrMsg,
} from './validation-message';

const baseSchema = object({
  name: string().required(requiredErrMsg('Name')).max(50, maxLenErrMsg(50)),
  email: string()
    .email(emailErrMsg)
    .required(requiredErrMsg('Email'))
    .max(50, maxLenErrMsg(50)),
  address: string()
    .required(requiredErrMsg('Address'))
    .max(100, maxLenErrMsg(100)),
  phone: string().required(requiredErrMsg('Phone')).max(20, maxLenErrMsg(20)),
  dob: string().required(requiredErrMsg('Date of Birth')),
  position: mixed().test(
    'Select-Required',
    requiredErrMsg('Position'),
    function (value: any) {
      if (value === undefined) {
        return false;
      }
      if (value.value === undefined) {
        return false;
      }
      return true;
    }
  ),
});

const createSchema = baseSchema.shape({
  password: string()
    .required(requiredErrMsg('Password'))
    .min(PASSWORD_MIN_LEN, minLenErrMsg(PASSWORD_MIN_LEN))
    .max(PASSWORD_MAX_LEN, maxLenErrMsg(PASSWORD_MAX_LEN)),
});

export const employeeCreateSchema = createSchema;

export const employeeUpdateSchema = baseSchema;
