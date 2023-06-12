/* eslint-disable no-magic-numbers */
import { object, string, mixed } from 'yup';
import { DATE_FORMAT_REGEX } from './validation-format';
import { dateErrMsg, maxLenErrMsg, requiredErrMsg } from './validation-message';

export const projectServerSchema = object({
  name: string().required(requiredErrMsg('Name')).max(50, maxLenErrMsg(50)),
  language: string()
    .required(requiredErrMsg('Language'))
    .max(50, maxLenErrMsg(50)),
  description: string()
    .required(requiredErrMsg('Description'))
    .max(255, maxLenErrMsg(255)),
  type: mixed().nullable(),
  startDate: string()
    .required(requiredErrMsg('Start Date'))
    .matches(DATE_FORMAT_REGEX, dateErrMsg('Start Date')),
  endDate: string()
    .required(requiredErrMsg('End Date'))
    .matches(DATE_FORMAT_REGEX, dateErrMsg('End Date'))
    .test(
      'dateTest',
      'End Date must be greater than Start Date',
      function (value) {
        const ed = new Date(value).getTime();
        const sd = new Date(this.parent.startDate).getTime();
        if (ed > sd) {
          return true;
        } else {
          return false;
        }
      }
    ),
});
