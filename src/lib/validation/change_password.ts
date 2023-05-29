/* eslint-disable no-magic-numbers */
import { object, string } from 'yup';
import { PASSWORD_MAX_LEN, PASSWORD_MIN_LEN } from './validation-format';
import {
  maxLenErrMsg,
  minLenErrMsg,
  requiredErrMsg,
} from './validation-message';

export const changePasswordSchema = object({
  newPassword: string()
    .required(requiredErrMsg('New Password'))
    .min(PASSWORD_MIN_LEN, minLenErrMsg(PASSWORD_MIN_LEN))
    .max(PASSWORD_MAX_LEN, maxLenErrMsg(PASSWORD_MAX_LEN)),
  confirmPassword: string()
    .required(requiredErrMsg('Confirm Password'))
    .max(50, maxLenErrMsg(50))
    .test(
      'Confirm-Pasword',
      'New Password and Confirm Password must be same',
      function (value) {
        const np = this.parent.newPassword;
        const cp = value;
        if (np === cp) {
          return true;
        } else {
          return false;
        }
      }
    ),
});
