/* eslint-disable no-magic-numbers */
/* eslint-disable indent */
'use client';
import React, { useCallback, useState, ReactElement, useEffect } from 'react';
import {
  Table,
  TableCell,
  TableHead,
  Tableheader,
  TableRow,
} from '@/components/Table';
import Link from 'next/link';
import useSWR from 'swr';
import { Task } from '@/lib/models/models';
import moment from 'moment';
import ModalDialog from '@/components/ModalDialog';
import LoadingSpinner from '@/components/Loading';
import { useRouter } from 'next/router';
import Pagination from '@/components/Pagination';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';
import NormalSelect, { ReactSelectOption } from '@/components/NormalSelect';
import { useSession } from 'next-auth/react';
import { POSITION_ADMIN } from '@/lib/constants';
import { classNames } from '@/lib/helper';
import TaskSearchBox from '@/components/TaskSearchBox';
import TaskExcelFileImport from '@/components/TaskExcelFileImport';
import TaskExcelFileExport from '@/components/TaskExcelFileExport';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const STATUS_LIST = [
  { value: -1, label: 'All' },
  { value: 0, label: 'Open' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Finish' },
  { value: 3, label: 'Close' },
  { value: 4, label: 'Review'},
  { value: 5, label: 'Not Close' },
] as ReactSelectOption[];

const TaskList: NextPageWithLayout = () => {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  const userId = session?.user?.id;
  // Router
  const router = useRouter();
  const query = router?.query;
  const search = query?.search as string;
  const page = (query.page as string) ?? '1';
  const limit = (query.limit as string) ?? '';
  const status = (query.status as string) ?? '4';
  const [selectedStatus, setSelectedStatus] = useState(STATUS_LIST[0]);

  const [searchKW, setSearchKW] = useState('');

  const { data, error, mutate } = useSWR(
    search
      ? '/api/tasks?search=' +
          search +
          '&page=' +
          page +
          '&limit=' +
          limit +
          '&status=' +
          status +
          '&userId=' +
          (isAdmin ? 0 : userId)
      : '/api/tasks' +
          '?page=' +
          page +
          '&limit=' +
          limit +
          '&status=' +
          status +
          '&userId=' +
          (isAdmin ? 0 : userId),
    fetcher
  );

  // Dialog Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectTaskId, setSelectTaskId] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeStatus = (e: any) => {
    setSelectedStatus(e);
    const newRoute =
      router.pathname +
      '?search=' +
      searchKW +
      '&page=' +
      '1' +
      '&limit=' +
      limit +
      '&status=' +
      e.value;
    router.push(newRoute);
  };

  const onSearchClick = () => {
    const newRoute =
      router.pathname +
      '?search=' +
      searchKW +
      '&page=' +
      '1' +
      '&limit=' +
      limit +
      '&status=' +
      selectedStatus.value;
    router.push(newRoute);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const onDeleteTaskClick = useCallback(
    (id: number) => {
      openModal();
      setSelectTaskId(id);
    },
    [openModal]
  );

  const deleteTaskDataLocally = useCallback(() => {
    const tempData = data.data.filter((p: Task) => p.id !== selectTaskId);
    mutate(tempData);
  }, [data, mutate, selectTaskId]);

  const onDeleteTask = useCallback(async () => {
    closeModal();
    closeModal();
    setLoading(true);
    await fetch('/api/tasks/' + selectTaskId, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          deleteTaskDataLocally();
          setLoading(false);
        }
      });
    setLoading(false);
  }, [closeModal, deleteTaskDataLocally, selectTaskId]);

  useEffect(() => {
    if (router.query.status) {
      const sts = parseInt(router.query.status as string);
      setSelectedStatus(STATUS_LIST.filter((s) => s.value === sts)[0]);
    }
  }, [router]);

  if (error) {
    return (
      <div className="w-full flex justify-center p-4">
        <p className="font-semibold text-gray-800 mt-20">
          An error has occoured.
        </p>
      </div>
    );
  }
  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <main className="relative">
        <div className="container mx-auto p-2.5 pt-5 max-w-screen-xl">
          <section>
            <div className="w-full flex flex-col lg:flex-row space-y-4 sm:flex-row sm:space-y-0 items-center justify-between mb-4">
              <div className="flex flex-col space-y-4 sm:flex-row  sm:space-y-0 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <span className="block text-sm font-medium text-primary">
                    Status
                  </span>
                  <div className="w-full sm:w-36 mt-2 sm:mt-0 sm:ms-2">
                    <NormalSelect
                      defaultValue={selectedStatus}
                      optionsObject={STATUS_LIST}
                      // eslint-disable-next-line react/jsx-no-bind
                      onChange={onChangeStatus}
                    />
                  </div>
                </div>

                <div className="w-full self-center sm:ms-4">
                  <TaskSearchBox
                    value={searchKW}
                    setValue={setSearchKW}
                    // eslint-disable-next-line react/jsx-no-bind
                    onSearch={onSearchClick}
                  />
                </div>
              </div>

              <div className=" flex flex-col space-y-4 sm:flex-row  sm:space-y-0 w-full sm:w-auto mb-4">
                <TaskExcelFileExport />
                <TaskExcelFileImport />
                {isAdmin && (
                  <Link
                    href="/task/add"
                    className="w-full h-full p-0 sm:w-fit lg:w-44 self-center "
                  >
                    <div className="flex justify-center text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm px-2.5 py-2.5 sm:ms-2">
                      <span className="sm:hidden lg:block me-2">New Task</span>
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
                )}
              </div>
            </div>
            {data?.data?.length > 0 ? (
              <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                      {data.data?.map((t: Task) => (
                        <TableRow
                          key={t.id}
                          className={
                            t.status !== 3 ? '' : 'odd:bg-red-100 even:bg-red-100'
                          }
                        >
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
                                      : t.status === 4
                                        ? 'Review'
                                        : 'Not Close'}
                          </TableCell>
                          <TableCell className="text-center">
                            {moment(t.estimateStartDate).format(
                              'YYYY-MM-DD hh:mm A'
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {moment(t.estimateEndDate).format(
                              'YYYY-MM-DD hh:mm A'
                            )}
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
                              ? moment(t.actualEndDate).format(
                                  'YYYY-MM-DD hh:mm A'
                                )
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <div
                              className={classNames(
                                isAdmin ? 'w-28' : 'w-1',
                                ' min-w-full'
                              )}
                            >
                              <Link
                                href={`/task/${t.id}/edit`}
                                className="font-medium text-green-600  hover:underline hover:text-green-800"
                              >
                                Update
                              </Link>
                              {isAdmin && (
                                <button
                                  type="button"
                                  // eslint-disable-next-line react/jsx-no-bind
                                  onClick={() => onDeleteTaskClick(t.id)}
                                  className="font-medium text-red-500 ms-4 hover:underline hover:text-red-700"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </TableCell>
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
              </div>
            ) : (
              <div className="w-full flex justify-center p-4">
                <p className="font-semibold text-gray-800 mt-20">
                  There is no data.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {isModalOpen && (
        <ModalDialog
          title="Delete Task"
          bodyText="Are you sure? Going to delete this task. This action cannot be undone."
          btnLeftTitle="Cancel"
          btnLeftOnClick={closeModal}
          btnRightTitle="Delete"
          btnRightOnClick={onDeleteTask}
          // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
          onClose={() => {}}
        />
      )}
    </>
  );
};

TaskList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TaskList;
