/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
import { object, string, mixed, number } from 'yup';
import {
  maxErrMsg,
  maxLenErrMsg,
  minErrMsg,
  requiredErrMsg,
} from './validation-message';

const baseSchema = object({
  project: mixed().test(
    'Select-Required',
    requiredErrMsg('Project'),
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
  type: mixed().nullable(),
  title: string().required(requiredErrMsg('Title')).max(50, maxLenErrMsg(50)),
  description: string()
    .required(requiredErrMsg('Description'))
    .max(255, maxLenErrMsg(255)),
  assignedEmployee: mixed().test(
    'Select-Required',
    requiredErrMsg('Assigned Employee'),
    function (value: any) {
      console.log('assign emp', value);
      if (value === undefined) {
        return false;
      }
      if (value.value === undefined) {
        return false;
      }
      return true;
    }
  ),
  estimateHour: number()
    .required(requiredErrMsg('Estimate Hour'))
    .min(0, minErrMsg(0))
    .max(50, maxErrMsg(50)),
  estimateStartDate: string().required(requiredErrMsg('Estimate Start Date')),
  estimateEndDate: string()
    .required(requiredErrMsg('Estimate End Date'))
    .test(
      'dateTest',
      'Estimate End Date must be greater than Estimate Start Date',
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
  reviewer: mixed().test(
    'Select-Required',
    'Assigned Employee and Reviewer must not be same!',
    function (value: any) {
      const assignedEmp = this.parent.assignedEmployee.value;
      if (value === undefined) {
        return false;
      }
      if (value.value === undefined) {
        return false;
      }
      if (value.value === assignedEmp) {
        return false;
      }
      return true;
    },
  ).test(
    'Select-Required',
    'Please select the assigned Employee',
    function () {
      const assignedEmp = this.parent.assignedEmployee.value;
      if (!assignedEmp) {
        return false;
      }
      return true;
    }
  ),
  reviewEstimateHour: number()
    .required(requiredErrMsg('Review Estimate Hour'))
    .min(0, minErrMsg(0))
    .max(50, maxErrMsg(50)),
  reviewEstimateStartDate: string().required(requiredErrMsg('Review Estimate Start Date'))
    .test(
      'Select-Required',
      'Please select the assigned Employee',
      function () {
        const assignedEmp = this.parent.assignedEmployee.value;
        if (!assignedEmp) {
          return false;
        }
        return true;
      }
    ),
  reviewEstimateEndDate: string()
    .required(requiredErrMsg('Review Estimate End Date'))
    .test(
      'dateTest',
      'Review Estimate End Date must be greater than Review Estimate Start Date',
      function (value) {
        const ed = new Date(value).getTime();
        const sd = new Date(this.parent.reviewEstimateStartDate).getTime();
        if (ed > sd) {
          return true;
        } else {
          return false;
        }
      }
    )
    .test(
      'dateTest',
      'Please select the assigned Employee',
      function () {
        const assignedEmp = this.parent.assignedEmployee.value;
        if (!assignedEmp) {
          return false;
        }
        return true;
      }
    ),
});

const updateSchema = baseSchema.shape({
  type: mixed().nullable(),
  status: mixed().test(
    'Select-Required',
    requiredErrMsg('Status'),
    function (value: any) {
      if (!value) {
        return false;
      }
      if (!value.value) {
        return false;
      }
      return true;
    }
  ),
  actualHour: string()
    .nullable()
    .min(0, minErrMsg(0))
    .max(50, maxErrMsg(50)),
  actualStartDate: string().nullable(),
  actualEndDate: string()
    .nullable()
    .test(
      'dateTest',
      'Actual end date must be greater than estimated actual start date',
      function (value: any) {
        if (value) {
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
  assignedEmployeePercent: number()
    .transform((value) => Number.isNaN(value) ? null : value)
    .nullable().min(0).max(100),
  reviewActualHour: string()
    .nullable()
    .min(0, minErrMsg(0))
    .max(50, maxErrMsg(50)),
  reviewActualStartDate: string().nullable(),
  reviewActualEndDate: string()
    .nullable()
    .test(
      'dateTest',
      'Review Actual end date must be greater than review estimated actual start date',
      function (value: any) {
        if (value) {
          const ed = new Date(value).getTime();
          const sd = new Date(this.parent.reviewActualStartDate).getTime();
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
  reviewerPercent: number()
    .transform((value) => Number.isNaN(value) ? null : value)
    .nullable().min(0).max(100)
});

export const taskCreateSchema = baseSchema;

export const taskUpdateSchema = updateSchema;
