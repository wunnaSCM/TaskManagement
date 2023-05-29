import React from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function CheckBox({
  id,
  label,
  helperText = '',
  type = 'checkbox',
  readOnly = false,
  validation,
  ...rest
}: {
  id: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  type?:
    | 'text'
    | 'email'
    | 'number'
    | 'password'
    | 'file'
    | 'hidden'
    | 'checkbox'
    | 'image'
    | 'radio'
    | 'search'
    | 'submit'
    | 'tel';
  readOnly?: boolean;
  validation?: RegisterOptions;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-primary"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...register(id, validation)}
          {...rest}
          id={id}
          name={id}
          type={type}
          readOnly={readOnly}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
        />

        {errors[id] && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ExclamationCircleIcon className="w-5 h-5 text-xl text-red-500" />
          </div>
        )}
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
    </div>
  );
}
