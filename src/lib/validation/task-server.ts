/* eslint-disable no-magic-numbers */
import { object, string, number } from 'yup';
import { DATETIME_FORMAT_REGEX } from './validation-format';
import {
  dateErrMsg,
  maxErrMsg,
  maxLenErrMsg,
  minErrMsg,
  requiredErrMsg,
} from './validation-message';

const baseSchema = object({
  project: string()
    .required(requiredErrMsg('Project'))
    .max(50, maxLenErrMsg(50)),
  title: string().required(requiredErrMsg('Title')).max(50, maxLenErrMsg(50)),
  description: string()
    .required(requiredErrMsg('Description'))
    .max(255, maxLenErrMsg(255)),
  assignedEmployee: number()
    .required(requiredErrMsg('Assigned Employee'))
    .min(1, minErrMsg(1)),
  estimateHour: number()
    .required(requiredErrMsg('Estimate Hour'))
    .min(0, minErrMsg(0))
    .max(50, maxErrMsg(50)),
  estimateStartDate: string()
    .required(requiredErrMsg('Start Date'))
    .matches(DATETIME_FORMAT_REGEX, dateErrMsg('Estimate Start Date')),
  estimateEndDate: string()
    .required(requiredErrMsg('End Date'))
    .matches(DATETIME_FORMAT_REGEX, dateErrMsg('Estimate End Date'))
    .test(
      'dateTest',
      'Estimated End Date must be greater than Estimated Start Date',
      function (value) {
        const ed = new Date(value).getTime();
        const sd = new Date(this.parent.estimateStartDate).getTime();
        if (ed > sd) {
          return true;
        } else {
          return false;
        }
      }
    ),
});

const updateSchema = baseSchema.shape({
  status: number()
    .required(requiredErrMsg('Status'))
    .min(0, minErrMsg(0))
    .max(3, maxErrMsg(3)),
  actualHour: number()
    .nullable()
    .min(0, minErrMsg(0))
    .max(50, maxErrMsg(50)),
  actualStartDate: string()
    .nullable()
    .matches(DATETIME_FORMAT_REGEX, dateErrMsg('Actual Start Date')),
  actualEndDate: string()
    .nullable()
    .matches(DATETIME_FORMAT_REGEX, dateErrMsg('Actual End Date'))
    .test(
      'dateTest',
      'Actual End Date must be greater than Actual Start Date',
      function (value) {
        if (value && this.parent.actualStartDate) {
          const ed = new Date(value).getTime();
          const sd = new Date(this.parent.actualStartDate).getTime();
          if (ed > sd) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    ),
});

export const taskCreateServerSchema = baseSchema;
export const taskUpdateServerSchema = updateSchema;
