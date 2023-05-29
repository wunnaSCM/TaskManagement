/* eslint-disable no-magic-numbers */
// eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
import Layout from '@/components/Layout';
import {
  Table,
  TableCell,
  TableCellImage,
  TableHead,
  Tableheader,
  TableRow,
} from '@/components/Table';
import React, { ReactElement, useCallback, useState } from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '../_app';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Employee } from '@/lib/models/models';
import ModalDialog from '@/components/ModalDialog';
import moment from 'moment';
import LoadingSpinner from '@/components/Loading';
import Pagination from '@/components/Pagination';
import SearchBox from '@/components/SearchBox';
import { useSession } from 'next-auth/react';
import { POSITION_ADMIN } from '@/lib/constants';
import { classNames } from '@/lib/helper';
import AccessDeniedPage from '@/components/AccessDeniedPage';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EmployeeList: NextPageWithLayout = () => {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  const userId = session?.user?.id;

  const router = useRouter();
  const query = router?.query;
  const search = query?.search as string;
  const page = (query.page as string) ?? '1';
  const limit = (query.limit as string) ?? '';

  const { data, error, mutate } = useSWR(
    search
      ? '/api/employees?search=' + search + '&page=' + page + '&limit=' + limit
      : '/api/employees' + '?page=' + page + '&limit=' + limit,
    fetcher
  );

  // Dialog Modal
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogBody, setDialogBody] = useState('');
  const [isLoading, setLoading] = useState(false);

  const [selectEmployee, setSelectEmployee] = useState<Employee>();

  const closeDeleteConfirmDialog = useCallback(() => {
    setDeleteConfirmDialogOpen(false);
  }, [setDeleteConfirmDialogOpen]);

  const openDeleteConfirmDialog = useCallback(() => {
    setDeleteConfirmDialogOpen(true);
  }, [setDeleteConfirmDialogOpen]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const openModal = useCallback(
    (title: string, bodyText: string) => {
      setDialogTitle(title);
      setDialogBody(bodyText);
      setIsModalOpen(true);
    },
    [setIsModalOpen]
  );

  const onDeleteEmployeeClick = useCallback(
    (employee: Employee) => {
      openDeleteConfirmDialog();
      setSelectEmployee(employee);
    },
    [openDeleteConfirmDialog]
  );

  const deleteEmployeeDataLocally = useCallback(() => {
    const tempData = data.data.filter(
      (e: Employee) => e.id !== selectEmployee?.id
    );
    mutate(tempData);
  }, [data, mutate, selectEmployee]);

  const onDeleteEmployee = useCallback(async () => {
    closeDeleteConfirmDialog();
    closeDeleteConfirmDialog();
    setLoading(true);
    await fetch('/api/employees/' + selectEmployee?.id, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          deleteEmployeeDataLocally();
          const title = 'Employee Deleted';
          const bodyText =
            '"' + selectEmployee?.name + '" is successfully deleted.';
          openModal(title, bodyText);
          setLoading(false);
        } else {
          const title = 'Delete Employee Fail';
          const bodyText =
            'There was an error occur. Project cannot be deleted.';
          openModal(title, bodyText);
          setLoading(false);
        }
      });
    setLoading(false);
  }, [
    closeDeleteConfirmDialog,
    selectEmployee?.id,
    selectEmployee?.name,
    deleteEmployeeDataLocally,
    openModal,
  ]);

  if (error) {
    return <p>An error has occurred.</p>;
  }
  if (!data) {
    return <LoadingSpinner />;
  }

  if (session && !isAdmin) {
    return <AccessDeniedPage />;
  }

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <main>
        <div className="container mx-auto p-2.5 pt-5 max-w-screen-xl">
          <section>
            <div className="flex justify-between items-center mb-3">
              <div className="w-50">
                <SearchBox value={search} />
              </div>
              {isAdmin && (
                <Link href="/employee/add">
                  <div className="flex text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm md:px-5 md:py-2.5 p-2.5 ml-2">
                    <span className="hidden sm:block me-2">New Employee</span>
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
            {data?.data?.length > 0 ? (
              <>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <Table>
                    <TableHead>
                      <tr>
                        <Tableheader>ID</Tableheader>
                        <Tableheader>Name</Tableheader>
                        <Tableheader>Email</Tableheader>
                        <Tableheader>Photo</Tableheader>
                        <Tableheader>Address</Tableheader>
                        <Tableheader>Phone</Tableheader>
                        <Tableheader>DOB</Tableheader>
                        <Tableheader>Position</Tableheader>
                        <Tableheader>Action</Tableheader>
                      </tr>
                    </TableHead>
                    <tbody>
                      {data.data?.map((e: Employee) => (
                        <TableRow key={e.id}>
                          <TableCell>{e.id}</TableCell>
                          <TableCell>{e.name}</TableCell>
                          <TableCell>{e.email}</TableCell>
                          <TableCellImage
                            src={e.photo ? e.photo : '/img/employee/user.png'}
                          />
                          <TableCell>{e.address}</TableCell>
                          <TableCell>{e.phone}</TableCell>
                          <TableCell>
                            <div className='w-20 min-w-fit'>
                              {moment(e.dob).format('YYYY-MM-DD')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {e.position === POSITION_ADMIN ? 'Admin' : 'Member'}
                          </TableCell>
                          <TableCell>
                            <div
                              className={classNames(
                                isAdmin ? 'w-36' : '',
                                ' min-w-full'
                              )}
                            >
                              <Link
                                href={'/employee/' + e.id}
                                className="font-medium text-blue-50 mr-4 hover:underline hover:text-blue-100"
                              >
                                Detail
                              </Link>
                              {isAdmin && (
                                <>
                                  <Link
                                    href={'/employee/edit/' + e.id}
                                    className="font-medium text-green-600  hover:underline hover:text-green-700"
                                  >
                                    Edit
                                  </Link>
                                  {e.id !== userId && (
                                    <button
                                      type="button"
                                      // eslint-disable-next-line react/jsx-no-bind
                                      onClick={() => onDeleteEmployeeClick(e)}
                                      className="font-medium text-red-500 ms-4 hover:underline hover:text-red-700"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </>
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
              </>
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

      {deleteConfirmDialogOpen && (
        <ModalDialog
          title="Delete Project"
          bodyText={`Are you sure to delete "${selectEmployee?.name}" ? This action can't be undone.`}
          btnLeftTitle="Cancel"
          btnLeftOnClick={closeDeleteConfirmDialog}
          btnRightTitle="Delete"
          btnRightOnClick={onDeleteEmployee}
          // eslint-disable-next-line react/jsx-no-bind, @typescript-eslint/no-empty-function
          onClose={() => {}}
        />
      )}
      {isModalOpen && (
        <ModalDialog
          title={dialogTitle}
          bodyText={dialogBody}
          btnRightTitle="Okay"
          btnRightOnClick={closeModal}
          // eslint-disable-next-line react/jsx-no-bind, @typescript-eslint/no-empty-function
          onClose={() => {}}
        />
      )}
    </>
  );
};

EmployeeList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EmployeeList;
