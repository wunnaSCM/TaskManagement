/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';

export default function SearchBox({
  value,
  placeholder,
}: {
  value?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(value ? value : '');

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    []
  );

  const onClearClick = useCallback(() => {
    setKeyword('');
    router.push(router.pathname);
  }, [router]);

  return (
    <>
      <form className="w-full flex items-center">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="w-full flex items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-200 p-2">
          <input
            type="text"
            id="search"
            name="search"
            value={keyword}
            onChange={onChangeHandler}
            className="w-full bg-transparent focus:outline-none rounded"
            placeholder={placeholder ? placeholder : 'Search'}
          />
          {keyword && (
            <XMarkIcon
              className="w-5 h-5 fill-gray-600 ms-2 cursor-pointer"
              onClick={onClearClick}
            />
          )}
        </div>
        <button
          type="submit"
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
      </form>
    </>
  );
}
