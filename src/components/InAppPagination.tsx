/* eslint-disable no-magic-numbers */
import usePagination from '@lucasmogari/react-pagination';
import cn from 'classnames';
import React, { memo, PropsWithChildren } from 'react';
import { classNames } from '@/lib/helper';

type Props = {
  page: number;
  itemCount: number;
  perPage: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangePage: any;
};

const InAppPagination = ({ page, itemCount, perPage, onChangePage }: Props) => {
  // use the usePagination hook
  // getPageItem - function that returns the type of page based on the index.
  // size - the number of pages
  const pages = Math.ceil(itemCount / perPage);

  const { getPageItem, totalPages } = usePagination({
    totalItems: itemCount,
    page: page,
    itemsPerPage: perPage,
    maxPageItems: pages > 7 ? 7 : pages,
  });

  const firstPage = 1;
  // calculate the next page
  const nextPage = Math.min(page + 1, totalPages);
  // calculate the previous page
  const prevPage = Math.max(page - 1, firstPage);
  // create a new array based on the total pages

  const arr =
    totalPages > 7
      ? totalPages > 9
        ? new Array(totalPages)
        : new Array(totalPages + 1)
      : new Array(totalPages + 2);

  const itemFrom = (page - 1) * perPage + 1;
  const tempItemTo = itemFrom + perPage - 1;
  const itemTo = tempItemTo > itemCount ? itemCount : tempItemTo;

  return (
    <div className="flex items-center justify-between bg-white px-4 py-4">
      <div className="flex flex-1 justify-between sm:hidden">
        {[...arr].map((_, i) => {
          const { page, disabled } = getPageItem(i);
          if (page === 'previous') {
            return (
              <PaginationLink
                onChangePage={onChangePage}
                page={prevPage}
                disabled={disabled}
                key={page}
              >
                <div
                  className={classNames(
                    disabled
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-white text-gray-700 hover:bg-primary hover:text-white',
                    'relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium'
                  )}
                >
                  <span>Previous</span>
                </div>
              </PaginationLink>
            );
          }
          if (page === 'next') {
            return (
              <PaginationLink
                onChangePage={onChangePage}
                page={nextPage}
                disabled={disabled}
                key={page}
              >
                <div
                  className={classNames(
                    disabled
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-white text-gray-700 hover:bg-primary hover:text-white',
                    'ml-3 relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium'
                  )}
                >
                  <span>Next</span>
                </div>
              </PaginationLink>
            );
          }
        })}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <span className="text-sm font-normal text-gray-500">
          Showing{' '}
          <span className="font-semibold text-gray-900">
            {itemFrom}-{itemTo}
          </span>{' '}
          of <span className="font-semibold text-gray-900">{itemCount}</span>
        </span>

        <div className="flex items-center">
          {[...arr].map((_, i) => {
            // getPageItem function returns the type of page based on the index.
            // it also automatically calculates if the page is disabled.
            const { page, disabled, current } = getPageItem(i);

            if (page === 'previous') {
              return (
                <PaginationLink
                  onChangePage={onChangePage}
                  page={prevPage}
                  disabled={disabled}
                  key={page}
                >
                  <div className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-primary  hover:fill-white focus:z-20 focus:outline-offset-0">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </PaginationLink>
              );
            }

            if (page === 'gap') {
              return (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${page}-${i}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                >
                  ...
                </span>
              );
            }

            if (page === 'next') {
              return (
                <PaginationLink
                  onChangePage={onChangePage}
                  page={nextPage}
                  disabled={disabled}
                  key={page}
                >
                  <div className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-primary hover:fill-white focus:z-20 focus:outline-offset-0">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </PaginationLink>
              );
            }

            return (
              <PaginationLink
                onChangePage={onChangePage}
                active={current}
                key={page}
                page={page}
              >
                {page ? (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-primary hover:fill-white hover:text-white">
                    {page}
                  </span>
                ) : (
                  <></>
                )}
              </PaginationLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

type PaginationLinkProps = {
  page?: number | string;
  active?: boolean;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangePage?: any;
} & PropsWithChildren;

function PaginationLink({
  page,
  children,
  onChangePage,
  ...props
}: PaginationLinkProps) {
  return (
    <div
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => onChangePage(page)}
      className={cn({
        'bg-primary text-white': props.active,
        'font-bold text-indigo-700 text-white': props.active,
        'text-indigo-400': !props.active,
        'pointer-events-none text-gray-200 fill-gray-300': props.disabled,
      })}
    >
      {children}
    </div>
  );
}
export default memo(InAppPagination);
