/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';

export default function TaskSearchBox({
  value,
  setValue,
  placeholder,
  onSearch,
}: {
  value: any;
  setValue: any;
  placeholder?: string;
  onSearch: any;
}) {
  const router = useRouter();

  const onClearClick = useCallback(() => {
    const newRoute = router.asPath.replace(`search=${value}`, 'search=');
    setValue('');
    router.push(newRoute);
  }, [router, setValue, value]);

  return (
    <>
      <div className="w-full flex items-center">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="w-full flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-200 p-2">
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
              onClick={onClearClick}
            />
          )}
        </div>
        <button
          type="button"
          onClick={onSearch}
          className="p-2.5 ml-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </div>
    </>
  );
}
