import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../../_app';
import { useRouter } from 'next/router';
import moment from 'moment';
import useSWR from 'swr';
import { Project, Task, TaskByProject } from '@/lib/models/models';
import { classNames } from '@/lib/helper';
import NormalSelect, { ReactSelectOption } from '@/components/NormalSelect';
import { useSession } from 'next-auth/react';
import { POSITION_ADMIN } from '@/lib/constants';

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
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  const userId = session?.user?.id;

  // Router
  const router = useRouter();
  const id = router.query.id;
  const [selectedStatus, setSelectedStatus] = useState(STATUS_LIST[0]);
  const [filterList, setFilterList] = useState([]);

  const { data } = useSWR(`/api/projects/${id}/task`, fetcher);
  console.log('data', data?.data);

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

  useEffect(() => {
    setFilterList(data?.data);
  }, [data?.data]);

  function getFilteredList() {
    if (!selectedStatus) {
      return filterList;
    }

    console.log('filterList', filterList);
    filterList?.map((i) => console.log('status', i.status));
    return filterList?.filter((item) => item.status === selectedStatus);
  }

  const displayList = useMemo(getFilteredList, [selectedStatus, filterList]);

  const onChangeStatus = (e: any) => {
    setSelectedStatus(e);
  };

  console.log('displayList', displayList);

  return (
    <>
      <main className="relative">
        <div className="container mx-auto p-2.5 pt-5 max-w-screen-xl">
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <span className="block text-sm font-medium text-primary">
                Status
              </span>
              <div className="w-full sm:w-36 mt-2 sm:mt-0 sm:ms-2">
                {/* <NormalSelect
                  defaultValue={selectedStatus}
                  optionsObject={STATUS_LIST}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={onChangeStatus}
                /> */}

                <select
                  name="category-list"
                  id="category-list"
                  onChange={onChangeStatus}
                >
                  <option value="4">All</option>
                  <option value="0">Open</option>
                  <option value="1">In Progress</option>
                  <option value="2">Finish</option>
                  <option value="3">Close</option>
                  <option value="5">Not Close</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              {/* <table className=" border text-center text-sm divide-y divide-gray-200">
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
                  {data?.data?.map((t: TaskByProject) => (
                    <tr key={t.id}>
                      <td className="text-center border-r border-b">{t.id}</td>
                      <td className="text-center border-r border-b">
                        {t.projectName}
                      </td>
                      <td className="text-center border-r border-b">
                        {t.employeeName}
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
              </table> */}

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
