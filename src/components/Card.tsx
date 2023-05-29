/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export default function Card({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
      <div className="border-b border-gray-200 rounded-t-lg bg-gray-50 p-4">
        <h6 className="text-md font-medium text-gray-500">{title}</h6>
      </div>
      <div className="bg-white rounded-lg p-4">{children}</div>
    </div>
  );
}
