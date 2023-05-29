/* eslint-disable no-magic-numbers */
import { object, string } from 'yup';
import { PASSWORD_MAX_LEN, PASSWORD_MIN_LEN } from './validation-format';
import {
  emailErrMsg,
  maxLenErrMsg,
  minLenErrMsg,
  requiredErrMsg,
} from './validation-message';

export const userLoginSchema = object({
  email: string()
    .email(emailErrMsg)
    .required(requiredErrMsg('Email'))
    .max(50, maxLenErrMsg(50)),
  password: string()
    .required(requiredErrMsg('Password'))
    .min(PASSWORD_MIN_LEN, minLenErrMsg(PASSWORD_MIN_LEN))
    .max(PASSWORD_MAX_LEN, maxLenErrMsg(PASSWORD_MAX_LEN)),
});
