/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { classNames } from '@/lib/helper';
import React from 'react';
export function Table({ children }: { children?: any }) {
  return (
    <table className="w-full text-sm text-left text-gray-500">{children}</table>
  );
}

export function TableHead({ children }: { children?: any }) {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
      {children}
    </thead>
  );
}

export function Tableheader({ children }: { children?: any }) {
  return (
    <th scope="col" className="px-6 py-3">
      {children}
    </th>
  );
}

export function TableRow({
  children,
  className,
}: {
  children?: any;
  className?: string;
}) {
  return (
    <tr
      className={classNames(
        'bg-white border-b even:bg-gray-50',
        className ? className : ''
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className,
}: {
  children?: any;
  className?: string;
}) {
  return (
    <td className={classNames('px-2 py-4', className ? className : '')}>
      {children}
    </td>
  );
}

export function TableCellImage({ src }: { src: string }) {
  return (
    <td className="w-30 p-4">
      <img
        className="w-10 h-10 rounded-full mx-auto object-cover ring-1 ring-gray-300"
        src={src}
        alt="Employee Profile Image"
      ></img>
    </td>
  );
}
