import React from 'react';
import Select from 'react-select';

export interface ReactSelectOption {
  value: string | number;
  label: string;
}

export default function NormalSelect({
  optionsString,
  optionsObject,
  defaultValue,
  onChange,
  ...rest
}: {
  optionsString?: string[];
  optionsObject?: ReactSelectOption[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: any;
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
  };

  const options =
    optionsObject !== undefined
      ? optionsObject
      : optionsString?.map((option) => ({ value: option, label: option }));

  return (
    <div>
      <Select
        placeholder=""
        options={options}
        styles={customStyles}
        onChange={onChange}
        components={{ IndicatorSeparator: () => null }}
        defaultValue={defaultValue}
        {...rest}
      />
    </div>
  );
}
