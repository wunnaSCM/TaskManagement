/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
export default function ProjectSearchBox({
  value,
  setValue,
  placeholder,
}: {
  value?: string;
  setValue?: any;
  placeholder?: string;
}) {
  return (
    <>
      <div className="w-full flex items-center">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="w-full flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-200 p-2">
          <MagnifyingGlassIcon className='w-6 h-6 me-2 stroke-gray-600'/>
          <input
            type="text"
            id="search"
            name="search"
            value={value}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(e) => {
              setValue(e.target.value);
            }}
            className="w-full bg-transparent focus:outline-none rounded"
            placeholder={placeholder ? placeholder : 'Search'}
          />
          {value && (
            <XMarkIcon
              className="w-5 h-5 fill-gray-600 ms-2 cursor-pointer"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => {
                setValue('');
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
