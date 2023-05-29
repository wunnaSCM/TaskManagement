/* eslint-disable no-magic-numbers */
import { object, string } from 'yup';
import {
  emailErrMsg,
  maxLenErrMsg,
  requiredErrMsg,
} from './validation-message';

export const forgetPasswordSchema = object({
  email: string()
    .email(emailErrMsg)
    .required(requiredErrMsg('Email'))
    .max(50, maxLenErrMsg(50)),
});
