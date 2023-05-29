import React, { useCallback, useState } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

import { classNames } from '@/lib/helper';

export default function PasswordInput({
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

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      togglePassword();
    },
    []
  );

  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-primary"
        >
          {label}
          {requiredField && <span className="text-red-400">&nbsp;*</span>}
        </label>
      )}
      <div className="relative">
        <input
          {...register(id, validation)}
          {...rest}
          type={showPassword ? 'text' : 'password'}
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

        <button
          type="button"
          onClick={handleOnClick}
          className="absolute inset-y-0 right-0 flex items-center p-1 mr-3 rounded-lg focus:outline-none"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
          ) : (
            <EyeIcon className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
          )}
        </button>
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
