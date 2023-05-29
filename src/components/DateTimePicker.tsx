import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { classNames } from '@/lib/helper';

export default function DateTimePicker({
  id,
  label,
  placeholder,
  validation,
  defaultYear,
  defaultMonth,
  defaultValue,
  helperText,
  readOnly = false,
  requiredField = false,
  onChange,
  minDate,
  maxDate,
  ...rest
}: {
  id: string;
  label?: string;
  placeholder?: string;
  validation?: RegisterOptions;
  defaultYear?: number;
  defaultMonth?: number;
  defaultValue?: number;
  helperText?: string;
  readOnly?: boolean;
  requiredField?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  minDate?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maxDate?: any;
}) {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const defaultDate = new Date();
  if (defaultYear) {
    defaultDate.setFullYear(defaultYear);
  }
  if (defaultMonth) {
    defaultDate.setMonth(defaultMonth);
  }

  return (
    <div className="relative mb-5">
      {label && (
        <p
          // htmlFor={id}
          className="block mb-2 text-sm font-medium text-primary"
        >
          {label}
          {requiredField && <span className="text-red-400">&nbsp;*</span>}
        </p>
      )}

      {onChange ? (
        <Controller
          control={control}
          rules={validation}
          defaultValue={defaultValue}
          name={id}
          // eslint-disable-next-line react/jsx-no-bind
          render={({ field: { onBlur, value } }) => (
            <>
              <div className="relative mt-1">
                <ReactDatePicker
                  name={id}
                  onBlur={onBlur}
                  onChange={onChange}
                  selected={value}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd h:mm aa"
                  className={classNames(
                    readOnly
                      ? 'bg-gray-100 text-gray-400 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300'
                      : errors[id]
                        ? 'bg-white text-gray-900 border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'bg-white text-gray-900 border-gray-300 focus:ring-gray-200',
                    'block w-full border text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2'
                  )}
                  placeholderText={placeholder}
                  aria-describedby={id}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  openToDate={value ?? defaultDate}
                  // dateFormat="yyyy-MM-dd"
                  readOnly={readOnly}
                  minDate={minDate ? minDate: false}
                  maxDate={maxDate ? maxDate: false}
                  autoComplete="off"
                  {...rest}
                />
                <CalendarIcon className="w-5 h-5 absolute text-lg text-gray-500 transform -translate-y-1/2 pointer-events-none right-4 top-1/2" />
              </div>
              <div className="mt-1">
                {helperText !== '' && (
                  <p className="text-xs text-gray-500">{helperText}</p>
                )}
                {errors[id] && (
                  <span className="text-sm text-red-500">
                    {errors[id]?.message as string}
                  </span>
                )}
              </div>
            </>
          )}
        />
      ) : (
        <Controller
          control={control}
          rules={validation}
          defaultValue={defaultValue}
          name={id}
          // eslint-disable-next-line react/jsx-no-bind
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <div className="relative mt-1">
                <ReactDatePicker
                  name={id}
                  onBlur={onBlur}
                  onChange={onChange}
                  selected={value}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd h:mm aa"
                  className={classNames(
                    readOnly
                      ? 'bg-gray-200 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300'
                      : errors[id]
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-gray-200',
                    'block w-full bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2'
                  )}
                  placeholderText={placeholder}
                  aria-describedby={id}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  openToDate={value ?? defaultDate}
                  // dateFormat="yyyy-MM-dd"
                  readOnly={readOnly}
                  minDate={minDate ? minDate: false}
                  maxDate={maxDate ? maxDate: false}
                  autoComplete="off"
                  {...rest}
                />
                <CalendarIcon className="w-5 h-5 absolute text-lg text-gray-500 transform -translate-y-1/2 pointer-events-none right-4 top-1/2" />
              </div>
              <div className="mt-1">
                {helperText !== '' && (
                  <p className="text-xs text-gray-500">{helperText}</p>
                )}
                {errors[id] && (
                  <span className="text-sm text-red-500">
                    {errors[id]?.message as string}
                  </span>
                )}
              </div>
            </>
          )}
        />
      )}
    </div>
  );
}
