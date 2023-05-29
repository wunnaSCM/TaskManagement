/* eslint-disable @next/next/no-img-element */
import { classNames } from '@/lib/helper';
import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';

export default function ImageInput({
  id,
  label,
  validation,
  requiredField = false,
  ...rest
}: {
  id: string;
  label?: string;
  validation?: RegisterOptions;
  requiredField?: boolean;
}) {
  const {
    register,
    setValue,
    getValues,
    resetField,
    formState: { errors },
  } = useFormContext();

  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [fileName, setFileName] = useState('');

  const pickImage = useCallback(
    (event:React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setSelectedImageUri(URL.createObjectURL(file));
        setFileName(file.name);
        setValue(id, file);
      }
    },
    [id, setValue]
  );

  const removeImage = useCallback(() => {
    setSelectedImageUri('');
    setFileName('');
    resetField(id);
  }, [id, resetField]);

  useEffect(() => {
    const oldImg = getValues(id);
    if (typeof oldImg === 'string') {
      setSelectedImageUri(oldImg);
      const fileName = oldImg.split('/employee/').pop() as string;
      setFileName(fileName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-5">
      {label && (
        <p className="block mb-2 text-sm font-medium text-primary">
          {label}
          {requiredField && <span className='text-red-400'>&nbsp;*</span>}
        </p>
      )}
      <div className="relative flex items-center justify-center w-full">
        <label
          htmlFor={id}
          className={classNames(
            'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 overflow-hidden',
            errors[id] ? 'border-red-400 ' : 'border-gray-300 '
          )}
        >
          {selectedImageUri && selectedImageUri !== 'undefined' ? (
            <img
              src={selectedImageUri}
              alt="Uploaded Image"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
            </div>
          )}
          <input
            id={id}
            type="file"
            accept="image/*"
            {...register(id, validation)}
            {...rest}
            onChange={pickImage}
            hidden
          />
        </label>
        {selectedImageUri && selectedImageUri !== 'undefined' && (
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-4 right-4"
          >
            <div className="rounded bg-red-500/80 text-white text-sm px-2 py-1">
              Remove
            </div>
          </button>
        )}
      </div>
      {fileName && <p className="truncate">{fileName}</p>}

      <div className="mt-1">
        {errors[id] && (
          <span className="text-sm text-red-500">
            {errors[id]?.message as string}
          </span>
        )}
      </div>
    </div>
  );
}
