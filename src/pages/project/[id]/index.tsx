/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { ReactElement, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../../_app';
import { useRouter } from 'next/router';
import moment from 'moment';
import useSWR from 'swr';
import { TaskByProject } from '@/lib/models/models';
import { classNames } from '@/lib/helper';
import NormalSelect, { ReactSelectOption } from '@/components/NormalSelect';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const STATUS_LIST = [
  { value: 4, label: 'All' },
  { value: 0, label: 'Open' },
  { value: 1, label: 'In Progress' },
  { value: 2, label: 'Finish' },
  { value: 3, label: 'Close' },
  { value: 5, label: 'Not Close' },
] as ReactSelectOption[];

const ProjectDetail: NextPageWithLayout = () => {
  // Router
  const router = useRouter();
  const id = router.query.id;
  const [selectedStatus, setSelectedStatus] = useState(STATUS_LIST[0]);

  const { data } = useSWR(`/api/projects/${id}/task`, fetcher);

  function projectById(id: number) {
    const { data, error, isLoading } = useSWR(`/api/projects/${id}`, fetcher);

    return {
      project: data,
      isLoading,
      isError: error,
    };
  }

  function projectByGetEmployee() {
    const { data } = useSWR(`/api/projects/${id}/employees`, fetcher);

    return {
      employees: data?.data,
    };
  }

  const res = projectById(id);
  console.log('res', res);
  const employees = projectByGetEmployee();
  const EMPLOYEE_LIST = Object.values(employees);
  EMPLOYEE_LIST?.[0]?.unshift({ value: -1, label: 'All' });

  // remove duplicate employee id and name
  const EMPLOYEE_LIST_UPDATE = EMPLOYEE_LIST?.[0]?.filter((obj, index) => {
    return (
      index ===
      EMPLOYEE_LIST[0]?.findIndex(
        (o) => obj.value === o.value && obj.label === o.label
      )
    );
  });

  const [selectedEmployee, setSelectedEmployee] = useState(
    EMPLOYEE_LIST_UPDATE?.[0] ?? { value: -1, label: 'All' }
  );

  const TableHeaderMonthComponent = () => {
    const start = moment(res.project?.data?.startDate);
    const end = moment(res.project?.data?.endDate);
    const headArr = [];

    for (
      let date = start.clone();
      date.isSameOrBefore(end, 'day');
      date.add(1, 'day')
    ) {
      const endOfMonth = moment(date).endOf('month');
      const diff = endOfMonth.diff(date, 'day');
      date.add(diff, 'day');
      headArr.push(
        <th
          key={`header-by-month${date.toISOString()}`}
          className="border bg-gray-300"
          colSpan={diff + 1}
        >
          {moment(date).format('YYYY-MM')}
        </th>
      );
    }
    return headArr;
  };

  const TableHeaderDayComponent = () => {
    const start = moment(res.project?.data?.startDate);
    const end = moment(res.project?.data?.endDate);
    const headArr = [];

    for (
      let date = start.clone();
      date.isSameOrBefore(end, 'day');
      date.add(1, 'day')
    ) {
      const endOfMonth = moment(date).endOf('month');
      const diff = endOfMonth.diff(date, 'months');
      date.add(diff, 'day');
      headArr.push(
        <th key={`header-by-day${date.toISOString()}`} className={classNames(
          moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'bg-primary rounded-full border' : 'border'
        )}>
          {moment(date).format('DD')}
        </th>
      );
    }
    // className={classNames(
    //   isActive
    //     ? 'text-primary'
    //     : 'text-gray-900 hover:text-primary',
    //   'rounded-md px-3 py-2 text-sm font-medium'
    // )}
    return headArr;
  };

  const TableCellComponent = ({
    cell,
    taskEstStartDate,
    taskEstEndDate,
    taskActStartDate,
    taskActEndDate,
  }) => {
    const start = moment(res.project?.data?.startDate);
    const end = moment(res.project?.data?.endDate);
    const headArr = [];

    for (
      let date = start.clone();
      date.isSameOrBefore(end, 'day');
      date.add(1, 'day')
    ) {
      const cellColor =
        date.day() === 0 || date.day() === 6
          ? 'bg-gray-300' // Weekend
          : date.format('YYYY-MM-DD') >=
              taskActStartDate.format('YYYY-MM-DD') &&
            date.format('YYYY-MM-DD') <= taskActEndDate.format('YYYY-MM-DD')
            ? date.format('YYYY-MM-DD') > taskEstEndDate.format('YYYY-MM-DD') &&
            taskActEndDate.format('YYYY-MM-DD') >
              taskEstEndDate.format('YYYY-MM-DD')
              ? 'bg-[#e06666]' // OverDue
              : 'bg-[#00FF00]' // Progress
            : date.format('YYYY-MM-DD') >=
              taskEstStartDate.format('YYYY-MM-DD') &&
            date.format('YYYY-MM-DD') <= taskEstEndDate.format('YYYY-MM-DD')
              ? date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') &&
            date.format('YYYY-MM-DD') === taskEstEndDate.format('YYYY-MM-DD')
                ? 'bg-[#A52A2A]' // Deadline
                : 'bg-[#ffe599]' // Plan
              : '';
      headArr.push(
        <th
          key={`header-by-day${date.toISOString()}`}
          className={classNames('border', cellColor)}
        ></th>
      );
    }
    return headArr;
  };

  function getFilteredList() {
    return data?.data?.filter((item) => {
      return (
        (selectedEmployee?.value === -1 ||
          item.employeeId === selectedEmployee?.value) &&
        (selectedStatus?.value === 4 || item.status === selectedStatus?.value)
      );
    });
  }

  const displayList = useMemo(getFilteredList, [
    data?.data,
    selectedStatus?.value,
    selectedEmployee?.value,
  ]);

  const onChangeStatus = (e: any) => {
    setSelectedStatus(e);
  };

  const onChangeEmployee = (e: any) => {
    setSelectedEmployee(e);
  };

  return (
    <>
      <main className="relative">
        <div className="container mx-auto p-1 pt-5 max-w-screen-xl">
          <section>
            <div className="flex my-5">
              <div className='flex mr-3'>
                <h2 className='text-base'>Name:</h2>
                <h2 className='text-base'>{res?.project?.data?.name}</h2>
              </div>
              <div className='flex mr-3'>
                <h2 className='text-base'>Language:</h2>
                <h2 className='text-base'>{res?.project?.data?.language}</h2>
              </div>
              <div className='flex mr-3'>
                <h2 className='text-base'>Description:</h2>
                <h2 className='text-base'>{res?.project?.data?.description}</h2>
              </div>
              <div className='flex mr-3'>
                <h2 className='text-base'>Start Date:</h2>
                <h2 className='text-base'>{moment(res?.project?.data?.startDate).format('YYYY-MM-DD')}</h2>
              </div>
              <div className='flex mr-3'>
                <h2 className='text-base'>End Date:</h2>
                <h2 className='text-base'>{moment(res?.project?.data?.endDate).format('YYYY-MM-DD')}</h2>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className='flex'>
                <div className="block mt-2 text-sm font-medium text-primary">
                  Employee
                </div>
                <div className="w-full sm:w-36 mt-2 sm:mt-0 sm:ms-2">
                  <NormalSelect
                    defaultValue={selectedEmployee}
                    optionsObject={EMPLOYEE_LIST_UPDATE}
                    onChange={onChangeEmployee}
                  />
                </div>
                <div className="block mt-2 text-sm font-medium text-primary ml-5">
                  Status
                </div>
                <div className="w-full sm:w-36 mt-2 sm:mt-0 sm:ms-2">
                  <NormalSelect
                    defaultValue={selectedStatus}
                    optionsObject={STATUS_LIST}
                    onChange={onChangeStatus}
                  />
                </div>
                <div className="block mt-2 text-sm font-medium text-primary ml-5">
                  Date Range
                </div>
                <div className="w-full sm:w-36 mt-2 sm:mt-0 sm:ms-2">
                  <NormalSelect
                    defaultValue={selectedStatus}
                    optionsObject={STATUS_LIST}
                    onChange={onChangeStatus}
                  />
                </div>
              </div>
              <div className=''>
                <Link href="/task/add">
                  <div className="flex text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm md:px-5 md:py-2.5 p-2.5 ml-2">
                    <span className="hidden sm:block me-2">New Task</span>
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
            </div>
            <div className="flex mt-8 mb-8">
              <div className="order mr-4 w-6 h-6 border-2 border-black bg-[#ffe599]"></div>
              <div>Plan</div>
              <div className="order mx-4 w-6 h-6 border-2 border-black bg-[#00FF00]"></div>
              <div>In Progress</div>
              <div className="order mx-4  w-6 h-6 border-2 border-black bg-[#e06666]"></div>
              <div>Over Due</div>
              <div className="order mx-4  w-6 h-6 border-2 border-black bg-[#A52A2A]"></div>
              <div>Deadline</div>
              <div className="order mx-4  w-6 h-6 border-2 border-black bg-gray-300"></div>
              <div>Weekend</div>
              <div className="order mx-4  w-6 h-6 border-2 border-black bg-primary"></div>
              <div>Today</div>
            </div>
            <div className="relative">
              <div className="overflow-x-auto">
                {displayList?.length > 0 ? (
                  <table className="table-fixed border text-center text-sm divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th rowSpan={2} className="bg-gray-300 border-r">
                          ID
                        </th>
                        <th rowSpan={2} className="bg-gray-300 border-r">
                          Tasks
                        </th>
                        <th rowSpan={2} className="bg-gray-300 border-r">
                          Employee
                        </th>
                        <th rowSpan={2} className="bg-gray-300 border-r">
                          Status
                        </th>
                        <th rowSpan={2} className="bg-gray-300 border-r">
                          Hour
                        </th>
                        <th
                          colSpan={2}
                          className="bg-gray-300 border-r border-b"
                        >
                          Estimate
                        </th>
                        <th
                          colSpan={2}
                          className="bg-gray-300 border-r border-b"
                        >
                          Actual
                        </th>
                        <TableHeaderMonthComponent></TableHeaderMonthComponent>
                      </tr>
                      <tr>
                        <th className="border-r bg-gray-300">Start</th>
                        <th className="border-r bg-gray-300">End</th>
                        <th className="border-r bg-gray-300">Start</th>
                        <th className="border-r bg-gray-300">End</th>
                        <TableHeaderDayComponent></TableHeaderDayComponent>
                      </tr>
                    </thead>
                    <tbody>
                      {displayList?.map((t: TaskByProject) => (
                        <tr key={t.id}>
                          <td className="bg-gray-300 text-center border-r border-b w-[50px] min-w-[50px] py-2 sticky left-0">
                            {t.id}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px] sticky left-0">
                            {t.title}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[8px] min-w-[80px]">
                            {t.employeeName}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[80px] min-w-[80px]">
                            {t.status === 0
                              ? 'Open'
                              : t.status === 1
                                ? 'In Progress'
                                : t.status === 2
                                  ? 'Finish'
                                  : 'Close'}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[80px] min-w-[80px]">
                            {t.estimateHour}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px]">
                            {moment(t.estimateStartDate).format('YYYY-MM-DD')}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px]">
                            {moment(t.estimateEndDate).format('YYYY-MM-DD')}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px]">
                            {t.actualStartDate
                              ? moment(t.actualStartDate).format('YYYY-MM-DD')
                              : '-'}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px]">
                            {t.actualStartDate
                              ? moment(t.actualEndDate).format('YYYY-MM-DD')
                              : '-'}
                          </td>
                          <TableCellComponent
                            cell={t}
                            taskEstStartDate={moment(t.estimateStartDate)}
                            taskEstEndDate={moment(t.estimateEndDate)}
                            taskActStartDate={moment(t.actualStartDate)}
                            taskActEndDate={moment(t.actualEndDate)}
                          ></TableCellComponent>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="w-full flex justify-center p-4">
                    <p className="font-semibold text-gray-800 mt-20">
                      There is no data.
                    </p>
                  </div>
                )}
              </div>
              <div className="absolute top-0 left-0 z-1">
                {displayList?.length > 0 ? (
                  <table className="table-fixed border text-center text-sm divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th
                          rowSpan={2}
                          className="bg-gray-300 border-r h-[66px] min-h-[66px]"
                        >
                          ID
                        </th>
                        <th rowSpan={2} className="bg-gray-300 border-r">
                          Tasks
                        </th>
                        <th rowSpan={2} className="bg-gray-300 border-r">
                          Employee
                        </th>
                        <th rowSpan={2} className="bg-gray-300 border-r">
                          Status
                        </th>
                        <th rowSpan={2} className="bg-gray-300 border-r">
                          Hour
                        </th>
                        <th
                          colSpan={2}
                          className="bg-gray-300 border-r border-b"
                        >
                          Estimate
                        </th>
                        <th
                          colSpan={2}
                          className="bg-gray-300 border-r border-b"
                        >
                          Actual
                        </th>
                      </tr>
                      <tr>
                        <th className="border-r bg-gray-300">Start</th>
                        <th className="border-r bg-gray-300">End</th>
                        <th className="border-r bg-gray-300">Start</th>
                        <th className="border-r bg-gray-300">End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayList?.map((t: TaskByProject) => (
                        <tr key={t.id}>
                          <td className="bg-gray-300 text-center border-r border-b w-[50px] min-w-[50px] py-2 sticky left-0">
                            {t.id}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px] sticky left-0">
                            {t.title}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[8px] min-w-[80px]">
                            {t.employeeName}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[80px] min-w-[80px]">
                            {t.status === 0
                              ? 'Open'
                              : t.status === 1
                                ? 'In Progress'
                                : t.status === 2
                                  ? 'Finish'
                                  : 'Close'}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[80px] min-w-[80px]">
                            {t.estimateHour}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px]">
                            {moment(t.estimateStartDate).format('YYYY-MM-DD')}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px]">
                            {moment(t.estimateEndDate).format('YYYY-MM-DD')}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px]">
                            {t.actualStartDate
                              ? moment(t.actualStartDate).format('YYYY-MM-DD')
                              : '-'}
                          </td>
                          <td className="bg-gray-300 text-center border-r border-b w-[100px] min-w-[100px]">
                            {t.actualStartDate
                              ? moment(t.actualEndDate).format('YYYY-MM-DD')
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  ''
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

ProjectDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProjectDetail;
