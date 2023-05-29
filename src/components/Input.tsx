import React from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import { classNames } from '@/lib/helper';

export default function Input({
  id,
  label,
  placeholder = '',
  helperText = '',
  type = 'text',
  readOnly = false,
  requiredField = false,
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
  requiredField?: boolean;
  validation?: RegisterOptions;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='mb-5'>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-primary"
        >
          {label}
          {requiredField && <span className='text-red-400'>&nbsp;*</span>}
        </label>
      )}
      <div className="relative">
        <input
          {...register(id, validation)}
          {...rest}
          type={type}
          name={id}
          id={id}
          readOnly={readOnly}
          className={classNames(
            readOnly
              ? 'bg-gray-100 text-gray-500 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300'
              : errors[id]
                ? 'bg-gray-50 text-gray-900 border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'bg-white text-gray-900 border-gray-300 focus:ring-gray-200',
            'block w-full border text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2'
          )}
          placeholder={placeholder}
          aria-describedby={id}
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
