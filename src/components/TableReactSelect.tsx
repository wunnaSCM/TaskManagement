import { classNames } from '@/lib/helper';
import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import Select from 'react-select';

export default function TableReactSelect({
  id,
  placeholder,
  validation,
  disabled = false,
  optionsString,
  optionsObject,
  defaultValue,
  onChange,
  className,
  ...rest
}: {
  id: string;
  placeholder?: string;
  validation?: RegisterOptions;
  disabled?: boolean;
  optionsString?: string[];
  optionsObject?: object[];
  defaultValue?: string;
  requiredField?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: any;
  className?: string;
}) {
  const customStyles = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: (styles: any, state: any) => ({
      ...styles,
      border: state.isFocused ? '0' : '1px solid rgb(209, 213, 219)',
      // eslint-disable-next-line no-magic-numbers
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valueContainer: (styles: any) => ({
      ...styles,
      padding: '0px 0px 0px 5px',
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dropdownIndicator: (styles: any) => ({
      ...styles,
      paddingLeft: '3px',
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
    <div className={classNames(className ? className : '', 'w-20 min-w-full')}>
      <Controller
        name={id}
        defaultValue={
          defaultValue ? { value: defaultValue, label: defaultValue } : ''
        }
        control={control}
        rules={validation}
        // eslint-disable-next-line react/jsx-no-bind
        render={({ field }) => {
          const styles = errors[id] ? errorStyles : customStyles;
          return onChange ? (
            <Select
              {...field}
              isDisabled={disabled}
              placeholder={placeholder}
              options={options}
              styles={styles}
              onChange={onChange}
              components={{ IndicatorSeparator: () => null }}
              menuPlacement="bottom"
              maxMenuHeight={180}
              {...rest}
            />
          ) : (
            <Select
              {...field}
              isDisabled={disabled}
              placeholder={placeholder}
              options={options}
              styles={styles}
              components={{ IndicatorSeparator: () => null }}
              menuPlacement="bottom"
              maxMenuHeight={180}
              {...rest}
            />
          );
        }}
      />
      {errors[id] && (
        <span className="text-sm text-red-500 mt-2">
          {'* '}
          {errors[id]?.message as string}
        </span>
      )}
    </div>
  );
}
