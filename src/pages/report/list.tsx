/* eslint-disable no-magic-numbers */
'use client';
import React, { ReactElement } from 'react';
import {
  Table,
  TableCell,
  TableHead,
  Tableheader,
  TableRow,
} from '@/components/Table';
import Link from 'next/link';
import useSWR from 'swr';
import { Report } from '@/lib/models/models';
import moment from 'moment';
import LoadingSpinner from '@/components/Loading';
import { useRouter } from 'next/router';
import Pagination from '@/components/Pagination';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';
import ReportSearchBox from '@/components/ReportSearchBox';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ReportList: NextPageWithLayout = () => {
  const router = useRouter();

  const query = router?.query;
  const reportTo = query?.reportTo as string;
  const reportBy = query?.reportBy as string;
  const date = query?.date as string;
  const page = (query.page as string) ?? '1';
  const limit = (query.limit as string) ?? '';

  const { data, isLoading, error } = useSWR(
    reportTo || reportBy || date
      ? '/api/reports?' +
          '&page=' +
          page +
          '&limit=' +
          limit +
          '&reportTo=' +
          reportTo +
          '&reportBy=' +
          reportBy +
          '&date=' +
          date
      : '/api/reports?page=' + page + '&limit=' + limit,
    fetcher
  );

  if (error) {
    return <p>An error has occurred.</p>;
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <main className="relative">
        <div className="container mx-auto p-2.5 pt-5 max-w-screen-xl">
          <div>
            <div className="w-full flex flex-col space-y-4 sm:flex-row sm:space-y-0 justify-between mb-4">
              <ReportSearchBox
                reportTo={reportTo}
                reportBy={reportBy}
                date={date}
              />
              <Link
                href="/report/add"
                className="w-full h-full p-0 sm:w-fit lg:w-44 self-center"
              >
                <div className="flex justify-center text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm px-2.5 py-2.5 sm:ms-2">
                  <span className="sm:hidden lg:block me-2">New Report</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </Link>
            </div>
            {data.data?.length > 0 ? (
              <>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <Table>
                    <TableHead>
                      <tr>
                        <Tableheader>Report ID</Tableheader>
                        <Tableheader>Date</Tableheader>
                        <Tableheader>Description</Tableheader>
                        <Tableheader>Report To</Tableheader>
                        <Tableheader>Report By</Tableheader>
                      </tr>
                    </TableHead>
                    <tbody>
                      {data.data?.map((r: Report) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.id}</TableCell>
                          <TableCell>
                            <div className='w-20 min-w-fit'>
                              {moment(r.date).format('YYYY-MM-DD')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <pre>{r.description}</pre>
                          </TableCell>
                          <TableCell>{r.reportTo.name}</TableCell>
                          <TableCell>{r.reportBy.name}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <Pagination
                  page={parseInt(page)}
                  perPage={data?.limit ?? 0} //limit
                  itemCount={data?.total ?? 0}
                />
              </>
            ) : (
              <div className="w-full flex justify-center p-4">
                <p className="font-semibold text-gray-800 mt-20">
                  There is no data.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

ReportList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ReportList;
