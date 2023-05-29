import React, { ReactElement } from 'react';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../../_app';
import { useRouter } from 'next/router';
import {
  Table,
  TableCell,
  TableHead,
  Tableheader,
  TableRow,
} from '@/components/Table';
import moment from 'moment';
import useSWR from 'swr';
import { Task } from '@/lib/models/models';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProjectDetail: NextPageWithLayout = () => {
  const router = useRouter();

  const { data, error, mutate } = useSWR('/api/tasks', fetcher);

  function getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  const result = getDaysInMonth(2, 2023);

  return (
    <>
      <main className="relative">
        <div className="container mx-auto p-2.5 pt-5 max-w-screen-xl">
          <section>
            <div>
              <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <Table>
                  <TableHead>
                    <tr>
                      <Tableheader>Task ID</Tableheader>
                      <Tableheader>Title</Tableheader>
                      <Tableheader>Task Owner</Tableheader>
                      <Tableheader>Status</Tableheader>
                      <Tableheader>Day</Tableheader>
                      <Tableheader>Actual Days</Tableheader>
                      <Tableheader>Start</Tableheader>
                      <Tableheader>End</Tableheader>
                      <Tableheader>Actual Start</Tableheader>
                      <Tableheader>Actual End</Tableheader>
                    </tr>
                  </TableHead>

                  <tbody>
                    {data?.data?.map((t: Task) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.id}</TableCell>
                        <TableCell>{t.project.name}</TableCell>
                        <TableCell>{t.assignedEmployee.name}</TableCell>
                        <TableCell>
                          {t.status === 0
                            ? 'Open'
                            : t.status === 1
                              ? 'In Progress'
                              : t.status === 2
                                ? 'Finish'
                                : 'Close'}
                        </TableCell>
                        <TableCell className="text-center">
                          {t.estimateHour}
                        </TableCell>
                        <TableCell className="text-center">
                          {t.actualHour ? t.actualHour : '-'}
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
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
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
