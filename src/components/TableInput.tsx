import React, { forwardRef } from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';

import { classNames } from '@/lib/helper';

export const TableInput = forwardRef(function TableInput(
  {
    id,
    placeholder = '',
    type = 'text',
    readOnly = false,
    validation,
    addOn,
    className,
    ...rest
  }: {
    id: string;
    placeholder?: string;
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
    addOn?: string;
    className?: string;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _ref
) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <div
        className={classNames(
          className ? className : '',
          readOnly
            ? 'bg-gray-200 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300'
            : errors[id]
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-gray-200',
          'flex bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 overflow-hidden'
        )}
      >
        <input
          {...register(id, validation)}
          {...rest}
          type={type}
          name={id}
          id={id}
          readOnly={readOnly}
          className="w-full bg-transparent p-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder={placeholder}
          aria-describedby={id}
        />
        {addOn && (
          <span className="h-full bg-gray-200 p-2 border-s border-gray-300">
            {addOn}
          </span>
        )}
      </div>
      {(errors[id]?.type === 'required' || errors[id]?.type === 'pattern') && (
        <span className="text-sm text-red-500 mt-2">
          {'* '}
          {errors[id]?.message as string}
        </span>
      )}
      {errors[id]?.type === 'min' && (
        <span className="text-sm text-red-500 mt-2">{'* below min'}</span>
      )}
      {errors[id]?.type === 'max' && (
        <span className="text-sm text-red-500 mt-2">{'* over max'}</span>
      )}
      {errors[id]?.type === 'maxLength' && (
        <span className="text-sm text-red-500 mt-2">{'* invalid'}</span>
      )}
    </div>
  );
});
