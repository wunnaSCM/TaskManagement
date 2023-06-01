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
  console.log('res', res?.project?.data?.name);
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

  const TableHeaderDayComponent = () => {
    const start = moment(res.project?.data?.startDate);
    const end = moment(res.project?.data?.endDate);

    const headArr = [];
    for (
      let date = start.clone();
      date.isSameOrBefore(end, 'day');
      date.add(1, 'day')
    ) {
      headArr.push(
        <th key={`header-by-day${date.toISOString()}`} className="border">
          {moment(date).format('DD')}
        </th>
      );
    }
    return headArr;
  };

  const TableDayComponent = ({
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
        <div className="container mx-auto p-2.5 pt-5 max-w-screen-xl">
          <section>
            <div>
              <h2>{res?.project?.data?.name}</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <span className="block text-sm font-medium text-primary">
                Employee
              </span>
              <div className="w-full sm:w-36 mt-2 sm:mt-0 sm:ms-2">
                <NormalSelect
                  defaultValue={selectedEmployee}
                  optionsObject={EMPLOYEE_LIST_UPDATE}
                  onChange={onChangeEmployee}
                />
              </div>
              <span className="block text-sm font-medium text-primary ml-5">
                Status
              </span>
              <div className="w-full sm:w-36 mt-2 sm:mt-0 sm:ms-2">
                <NormalSelect
                  defaultValue={selectedStatus}
                  optionsObject={STATUS_LIST}
                  onChange={onChangeStatus}
                />
              </div>
            </div>
            <div className="flex mt-8">
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
            </div>
            <div className="overflow-x-auto shadow-md mt-8">
              {displayList?.length > 0 ? (
                <table className=" border text-center text-sm divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-300">
                      <th rowSpan={2} className="border-r">
                        ID
                      </th>
                      <th rowSpan={2} className="border-r">
                        Tasks
                      </th>
                      <th rowSpan={2} className="border-r">
                        Employee
                      </th>
                      <th rowSpan={2} className="border-r">
                        Status
                      </th>
                      <th rowSpan={2} className="border-r">
                        Hour
                      </th>
                      <th colSpan={2} className="border-r border-b">
                        Estimate
                      </th>
                      <th colSpan={2} className="border-r border-b">
                        Actual
                      </th>
                      <th>Date</th>
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
                        <td className="text-center border-r border-b w-14 p-7">
                          {t.id}
                        </td>
                        <td className="text-center border-r border-b w-40">
                          {t.projectName}
                        </td>
                        <td className="text-center border-r border-b w-32">
                          {t.employeeName}
                        </td>
                        <td className="text-center border-r border-b w-20">
                          {t.status === 0
                            ? 'Open'
                            : t.status === 1
                              ? 'In Progress'
                              : t.status === 2
                                ? 'Finish'
                                : 'Close'}
                        </td>
                        <td className="text-center border-r border-b w-20">
                          {t.estimateHour}
                        </td>
                        <td className="text-center border-r border-b w-32">
                          {moment(t.estimateStartDate).format('YYYY-MM-DD')}
                        </td>
                        <td className="text-center border-r border-b w-32">
                          {moment(t.estimateEndDate).format('YYYY-MM-DD')}
                        </td>
                        <td className="text-center border-r border-b w-32">
                          {t.actualStartDate
                            ? moment(t.actualStartDate).format('YYYY-MM-DD')
                            : '-'}
                        </td>
                        <td className="text-center border-r border-b w-32">
                          {t.actualStartDate
                            ? moment(t.actualEndDate).format('YYYY-MM-DD')
                            : '-'}
                        </td>
                        <TableDayComponent
                          cell={t}
                          taskEstStartDate={moment(t.estimateStartDate)}
                          taskEstEndDate={moment(t.estimateEndDate)}
                          taskActStartDate={moment(t.actualStartDate)}
                          taskActEndDate={moment(t.actualEndDate)}
                        ></TableDayComponent>
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
