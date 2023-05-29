import React from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/lib/helper';

export default function TextArea({
  id,
  label,
  placeholder = '',
  helperText = '',
  readOnly = false,
  validation,
  requiredField = false,
  ...rest
}: {
  id: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  readOnly?: boolean;
  validation?: RegisterOptions;
  requiredField?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-primary"
        >
          {label}
          {requiredField && <span className="text-red-400">&nbsp;*</span>}
        </label>
      )}
      <div className="relative mt-1">
        <textarea
          {...register(id, validation)}
          rows={3}
          {...rest}
          name={id}
          id={id}
          readOnly={readOnly}
          className={classNames(
            readOnly
              ? 'bg-gray-200 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300'
              : errors[id]
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-gray-200',
            'block w-full bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2'
          )}
          placeholder={placeholder}
          aria-describedby={id}
        />
        {errors[id] && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ExclamationCircleIcon className="text-xl text-red-500" />
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
