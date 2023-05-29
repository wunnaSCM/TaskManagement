/* eslint-disable no-magic-numbers */
import { object, string, number } from 'yup';
import {
  DATE_FORMAT_REGEX,
  PASSWORD_MAX_LEN,
  PASSWORD_MIN_LEN,
} from './validation-format';
import {
  dateErrMsg,
  emailErrMsg,
  maxErrMsg,
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
  photo: string().nullable(),
  phone: string().required(requiredErrMsg('Phone')).max(20, maxLenErrMsg(20)),
  dob: string()
    .required(requiredErrMsg('Date of Birth'))
    .matches(DATE_FORMAT_REGEX, dateErrMsg('Date of Birth')),
  position: number().required(requiredErrMsg('Position')).max(2, maxErrMsg(2)),
});

const createSchema = baseSchema.shape({
  password: string()
    .required(requiredErrMsg('Password'))
    .min(PASSWORD_MIN_LEN, minLenErrMsg(PASSWORD_MIN_LEN))
    .max(PASSWORD_MAX_LEN, maxLenErrMsg(PASSWORD_MAX_LEN)),
});

const updateSchema = baseSchema.shape({
  password: string()
    .nullable()
    .min(PASSWORD_MIN_LEN, minLenErrMsg(PASSWORD_MIN_LEN))
    .max(PASSWORD_MAX_LEN, maxLenErrMsg(PASSWORD_MAX_LEN)),
});

export const employeeCreateServerSchema = createSchema;

export const employeeUpdateServerSchema = updateSchema;
