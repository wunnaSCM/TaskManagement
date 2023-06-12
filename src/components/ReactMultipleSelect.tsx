/* eslint-disable no-magic-numbers */
import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';

export interface ReactSelectOption {
  value: string | number;
  label: string;
}

export default function ReactMultipleSelect({
  id,
  label,
  validation,
  helperText,
  optionsString,
  optionsObject,
  requiredField = false,
  onChange,
  ...rest
}: {
  id: string;
  label?: string;
  placeholder?: string;
  validation?: RegisterOptions;
  disabled?: boolean;
  helperText?: string;
  optionsString?: string[];
  optionsObject?: ReactSelectOption[];
  defaultValue?: string;
  requiredField?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: any;
}) {
  const customStyles = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: (styles: any, state: any) => ({
      ...styles,
      border: state.isFocused ? '0' : '1px solid rgb(209, 213, 219)',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgb(226, 232, 240)' : 0,
      '*': {
        boxShadow: 'none !important',
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    option: (styles: any, state: any) => ({
      ...styles,
      color: 'black',
      background: state.isSelected ? '#D1D5DB' : 'white',
      ':hover': {
        background: '#E5E7EB',
      },
    }),
  };

  const errorStyles = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: (styles: any) => ({
      ...styles,
      border: 'none',
      boxShadow: '0 0 0 0.04rem #EF4444',
      '*': {
        boxShadow: 'none !important',
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    option: (styles: any, state: any) => ({
      ...styles,
      color: 'black',
      background: state.isSelected ? '#D1D5DB' : 'white',
      ':hover': {
        background: '#E5E7EB',
      },
    }),
  };

  const options =
    optionsObject !== undefined
      ? optionsObject
      : optionsString?.map((option) => ({ value: option, label: option }));

  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full mb-5">
      {label && (
        <p
          // htmlFor={id}
          className="block mb-2 text-sm font-medium text-primary"
        >
          {label}
          {requiredField && <span className="text-red-400">&nbsp;*</span>}
        </p>
      )}
      <div className="relative mt-1">
        <Controller
          name={id}
          defaultValue={selectedValue}
          control={control}
          rules={validation}
          // eslint-disable-next-line react/jsx-no-bind
          render={({ field }) => {
            const styles = errors[id] ? errorStyles : customStyles;
            // return onChange ? (
            //   // <Select
            //   //   {...field}
            //   //   isDisabled={disabled}
            //   //   placeholder={placeholder}
            //   //   options={options}
            //   //   styles={styles}
            //   //   onChange={onChange}
            //   //   {...rest}
            //   // />
            //   <CreatableSelect isMulti {...field} options={options} onChange={handleSelectChange} {...rest} />
            // ) : (
            //   // <Select
            //   //   {...field}
            //   //   isDisabled={disabled}
            //   //   placeholder={placeholder}
            //   //   options={options}
            //   //   styles={styles}
            //   //   {...rest}
            //   // />
            //   <CreatableSelect isMulti {...field} options={options} onChange={handleSelectChange} {...rest} />
            // );
            return (
              <CreatableSelect
                {...field}
                isMulti
                options={options}
                {...rest}
              />
            );
          }}
        />
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
    </div>
  );
}
