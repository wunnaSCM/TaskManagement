import React, { ReactElement } from 'react';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../../_app';
import { useRouter } from 'next/router';
import moment from 'moment';
import useSWR from 'swr';
import { Task } from '@/lib/models/models';
import { classNames } from '@/lib/helper';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProjectDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id;

  const { data } = useSWR('/api/tasks', fetcher);

  function projectById(id: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error, isLoading } = useSWR(`/api/projects/${id}`, fetcher);

    return {
      project: data,
      isLoading,
      isError: error,
    };
  }

  const res = projectById(id);

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
          : date.format('YYYY-MM-DD') >= taskActStartDate.format('YYYY-MM-DD') &&
            date.format('YYYY-MM-DD') <= taskActEndDate.format('YYYY-MM-DD')
            ? date.format('YYYY-MM-DD') > taskEstEndDate.format('YYYY-MM-DD') &&
            taskActEndDate.format('YYYY-MM-DD') > taskEstEndDate.format('YYYY-MM-DD')
              ? 'bg-[#e06666]' // OverDue
              : 'bg-[#00FF00]' // Progress
            : date.format('YYYY-MM-DD') >= taskEstStartDate.format('YYYY-MM-DD') &&
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

  return (
    <>
      <main className="relative">
        <div className="container mx-auto p-2.5 pt-5 max-w-screen-xl">
          <section>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <table className=" border text-center text-sm divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th rowSpan={2} className="border-r">
                      Task ID
                    </th>
                    <th rowSpan={2} className="border-r">
                      Title
                    </th>
                    <th rowSpan={2} className="border-r">
                      Task Owner
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
                    <th className="border-r">Start</th>
                    <th className="border-r">End</th>
                    <th className="border-r">Start</th>
                    <th className="border-r">End</th>
                    <TableHeaderDayComponent></TableHeaderDayComponent>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map((t: Task) => (
                    <tr key={t.id}>
                      <td className="text-center border-r border-b">{t.id}</td>
                      <td className="text-center border-r border-b">
                        {t.project.name}
                      </td>
                      <td className="text-center border-r border-b">
                        {t.assignedEmployee.name}
                      </td>
                      <td className="text-center border-r border-b">
                        {t.status === 0
                          ? 'Open'
                          : t.status === 1
                            ? 'In Progress'
                            : t.status === 2
                              ? 'Finish'
                              : 'Close'}
                      </td>
                      <td className="text-center border-r border-b">
                        {t.estimateHour}
                      </td>
                      <td className="text-center border-r border-b">
                        {moment(t.estimateStartDate).format('YYYY-MM-DD')}
                      </td>
                      <td className="text-center border-r border-b">
                        {moment(t.estimateEndDate).format('YYYY-MM-DD')}
                      </td>
                      <td className="text-center border-r border-b">
                        {t.actualStartDate
                          ? moment(t.actualStartDate).format('YYYY-MM-DD')
                          : '-'}
                      </td>
                      <td className="text-center border-r border-b">
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
