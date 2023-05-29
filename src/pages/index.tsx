/* eslint-disable no-magic-numbers */
/* eslint-disable indent */
'use client';
import React, { useState, ReactElement } from 'react';
import {
  Table,
  TableCell,
  TableHead,
  Tableheader,
  TableRow,
} from '@/components/Table';
import Link from 'next/link';
import { Task } from '@/lib/models/models';
import moment from 'moment';
import LoadingSpinner from '@/components/Loading';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from './_app';
import {
  ClipboardDocumentListIcon,
  QueueListIcon,
  RectangleStackIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  useNotClosedTask,
  useProject,
  useEmployee,
  useReport,
  useAllTask,
} from '@/lib/swr/task';
import { useSession } from 'next-auth/react';
import { POSITION_ADMIN } from '@/lib/constants';

const Home: NextPageWithLayout = () => {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  const userId = session?.user?.id as number;
  // Router
  const router = useRouter();
  // Data List
  const { project, isProjectError } = useProject();
  const { employee, isEmpError } = useEmployee();
  const { notClosedtask, isnotClosedtaskError } = useNotClosedTask(
    isAdmin,
    userId
  );
  const { allTask, isallTaskError } = useAllTask(isAdmin, userId);
  const { report, isReportError } = useReport();

  // Dialog Modal
  const [isLoading] = useState(false);

  if (
    isProjectError ||
    isEmpError ||
    isnotClosedtaskError ||
    isReportError ||
    isallTaskError
  ) {
    return (
      <>
        <p className="flex text-black  justify-center item-center mt-3 font-medium rounded-lg text-sm px-2.5 py-2.5 sm:px-5 mx-auto">
          Fail to load...
        </p>
      </>
    );
  }

  if (!session) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <main className="relative">
        <div className="container mx-auto p-2.5 pt-5 max-w-screen-xl">
          <section>
            <div className="columns-2 space-y-4 md:columns-4 md:space-y-0 mb-4">
              <Link href="/task/list">
                <div className="w-full mb-2 h-20 sm:h-24 lg:h-28 rounded-xl overflow-hidden">
                  <div className="h-full bg-gradient-to-tr from-[#12c2e9] via-[#c471ed] to-[#f64f59] hover:from-[#7cd4e8] hover:via-[#9d6eb3] hover:to-[#db313f] p-3 sm:p-4 lg:p-6">
                    <div className="h-full flex items-center">
                      <QueueListIcon className="w-10 h-10 lg:w-12 lg:h-12 text-white " />
                      <div className="ms-6">
                        <p className="text-gray-50 font-bold text-2xl">
                          {' '}
                          {allTask?.total}
                        </p>
                        <p className="text-gray-100 font-thin text-md">Tasks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              {isAdmin && (
                <>
                  <Link href="/employee/list">
                    <div className="w-full h-20 sm:h-24 lg:h-28 rounded-xl overflow-hidden">
                      <div className="h-full bg-gradient-to-br from-[#fbfb66]  to-[#EF629F] hover:from-[#f0f048] hover:to-[#d22d74] p-3 sm:p-4 lg:p-6">
                        <div className="h-full flex items-center">
                          <UserGroupIcon className="w-10 h-10 lg:w-12 lg:h-12 text-white " />
                          <div className="ms-6">
                            <p className="text-gray-50 font-bold text-2xl">
                              {employee?.total}
                            </p>
                            <p className="text-gray-100 font-thin text-md">
                              Employees
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/project/list">
                    <div className="w-full mb-2 h-20 sm:h-24 lg:h-28 rounded-xl overflow-hidden">
                      <div className="h-full bg-gradient-to-tr from-[#68e7d8] to-[#ff92a2] hover:from-[#61b4aa] hover:to-[#ed7383] p-3 sm:p-4 lg:p-6">
                        <div className="h-full flex items-center">
                          <RectangleStackIcon className="w-10 h-10 lg:w-12 lg:h-12 text-white " />
                          <div className="ms-6">
                            <p className="text-gray-50 font-bold text-2xl">
                              {' '}
                              {project?.data?.length}
                            </p>
                            <p className="text-gray-100 font-thin text-md">
                              Projects
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              )}

              <Link href="/report/list">
                <div className="w-full h-20 sm:h-24 lg:h-28 rounded-xl overflow-hidden">
                  <div className="h-full bg-gradient-to-tr  from-[#A770EF] via-[#b8f0ab] to-[#fe8f5f]  hover:from-[#23a3c7] hover:via-[#9eea9a] hover:to-[#ed953d] p-3 sm:p-4 lg:p-6">
                    <div className="h-full flex items-center">
                      <ClipboardDocumentListIcon className="w-10 h-10 lg:w-12 lg:h-12 text-white " />
                      <div className="ms-6">
                        <p className="text-gray-50 font-bold text-2xl">
                          {' '}
                          {report?.total}
                        </p>
                        <p className="text-gray-100 font-thin text-md">
                          Reports
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-gray-800 font-bold text-2xl p-3">
                Top Not Closed Tasks
              </p>
            </div>
            <div className="relative overflow-x-auto border border-gray-200 shadow-md sm:rounded-lg">
              <Table>
                <TableHead>
                  <tr>
                    <Tableheader>Task ID</Tableheader>
                    <Tableheader>Title</Tableheader>
                    <Tableheader>Description</Tableheader>
                    <Tableheader>Project Name</Tableheader>
                    <Tableheader>Assigned Employee</Tableheader>
                    <Tableheader>Estimate Hour</Tableheader>
                    <Tableheader>Actual Hour</Tableheader>
                    <Tableheader>Status</Tableheader>
                    <Tableheader>Estimate Start Date</Tableheader>
                    <Tableheader>Estimate End Date</Tableheader>
                    <Tableheader>Actual Start Date</Tableheader>
                    <Tableheader>Actual End Date</Tableheader>
                    <Tableheader>Action</Tableheader>
                  </tr>
                </TableHead>

                <tbody>
                  {notClosedtask?.data?.map((t: Task) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.id}</TableCell>
                      <TableCell>{t.title}</TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>{t.project.name}</TableCell>
                      <TableCell>{t.assignedEmployee.name}</TableCell>
                      <TableCell className="text-center">
                        {t.estimateHour}
                      </TableCell>
                      <TableCell className="text-center">
                        {t.actualHour ? t.actualHour : '-'}
                      </TableCell>
                      <TableCell>
                        {t.status === 0
                          ? 'Open'
                          : t.status === 1
                          ? 'In Progress'
                          : t.status === 2
                          ? 'Finish'
                          : t.status === 3
                          ? 'Close'
                          : 'Not close'}
                      </TableCell>
                      <TableCell className="text-center">
                        {moment(t.estimateStartDate).format(
                          'YYYY-MM-DD hh:mm A'
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {moment(t.estimateEndDate).format('YYYY-MM-DD hh:mm A')}
                      </TableCell>
                      <TableCell className="text-center">
                        {t.actualStartDate
                          ? moment(t.actualStartDate).format(
                              'YYYY-MM-DD hh:mm A'
                            )
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {t.actualEndDate
                          ? moment(t.actualEndDate).format('YYYY-MM-DD hh:mm A')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="w-24 min-w-full">
                          <Link
                            href={`/task/${t.id}`}
                            className="font-medium text-green-600  hover:underline hover:text-green-800"
                          >
                            Update
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>

              {notClosedtask?.total === 0 && (
                <div className="w-full flex justify-center p-4">
                  <p className="font-semibold text-gray-800 mt-20">
                    There is no data.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => router.push('/task/list')}
              className="flex text-white bg-primary justify-center item-center hover:bg-primary-dark mt-3 font-medium rounded-lg text-sm px-2.5 py-2.5 sm:px-5 mx-auto"
            >
              <span className=" sm:block me-2">View More Tasks</span>
              <QueueListIcon className="w-5 h-5  text-white " />
            </button>
          </section>
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
