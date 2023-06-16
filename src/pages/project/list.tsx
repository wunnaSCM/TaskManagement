/* eslint-disable no-magic-numbers */
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
import { Project } from '@/lib/models/models';
import moment from 'moment';
import ModalDialog from '@/components/ModalDialog';
import LoadingSpinner from '@/components/Loading';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';
import { useSession } from 'next-auth/react';
import { POSITION_ADMIN, TASK_STATUS_CLOSE } from '@/lib/constants';
import InAppPagination from '@/components/InAppPagination';
import ProjectSearchBox from '@/components/ProjectSearchBox';
import { getFormattedCurrentDate } from '@/lib/format';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProjectList: NextPageWithLayout = () => {
  // Session
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  const currentDate = getFormattedCurrentDate();
  // Router
  const router = useRouter();
  const query = router?.query;
  const limit = parseInt((query.limit as string) ?? '5');

  const { data, error, mutate } = useSWR(
    isAdmin ? '/api/projects' : `/api/employees/${userId}/projects/`,
    fetcher
  );
  const [filterList, setFilterList] = useState<Project[]>([]);
  const [displayList, setDisplayList] = useState<Project[]>([]);
  const [page, setPage] = useState(
    parseInt(query.page ? (query.page as string) : '1')
  );
  const [searchKW, setSearchKW] = useState('');
  console.log('data', displayList.length, data);

  // Dialog Modal
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogBody, setDialogBody] = useState('');
  const [isLoading, setLoading] = useState(false);

  const [selectProject, setSelectProject] = useState<Project>();

  const closeDeleteConfirmDialog = useCallback(() => {
    setDeleteConfirmDialogOpen(false);
  }, [setDeleteConfirmDialogOpen]);

  const openDeleteConfirmDialog = useCallback(
    (title: string, bodyText: string) => {
      setDialogTitle(title);
      setDialogBody(bodyText);
      setDeleteConfirmDialogOpen(true);
    },
    [setDeleteConfirmDialogOpen]
  );

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

  const checkUndoneRelatedTaskExist = async (projectId: number) => {
    const allTasks = await fetch('/api/tasks/lists')
      .then((res) => res.json())
      .then((json) => json?.data);
    const filterUndoneTasks = allTasks.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (t: any) => t.projectId === projectId && t.status !== TASK_STATUS_CLOSE
    );
    // eslint-disable-next-line no-magic-numbers
    return filterUndoneTasks.length > 0;
  };

  const onDeleteProjectClick = useCallback(
    async (project: Project) => {
      setSelectProject(project);
      const isUndoneTaskExist = await checkUndoneRelatedTaskExist(project.id);
      const title = 'Delete Project';
      const bodyText = isUndoneTaskExist
        ? `Unclosed tasks are existed !!\n\nAre you sure to delete "${project?.name}" ?\nRelated Tasks also will be deleted.\nThis action can't be undone.`
        : `Are you sure to delete "${project?.name}" ?\nThis action can't be undone.`;
      openDeleteConfirmDialog(title, bodyText);
    },
    [openDeleteConfirmDialog]
  );

  const deleteProjectDataLocally = useCallback(() => {
    const tempData = data.data.filter(
      (p: Project) => p.id !== selectProject?.id
    );
    mutate(tempData);
  }, [data, mutate, selectProject]);

  const onDeleteProject = useCallback(async () => {
    closeDeleteConfirmDialog();
    closeDeleteConfirmDialog();
    setLoading(true);
    await fetch('/api/projects/' + selectProject?.id, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          deleteProjectDataLocally();
          const title = 'Project Deleted';
          const bodyText =
            '"' + selectProject?.name + '" is successfully deleted.';
          openModal(title, bodyText);
          setLoading(false);
        } else {
          const title = 'Delete Project Fail';
          const bodyText =
            'There was an error occur. Project cannot be deleted.';
          openModal(title, bodyText);
          setLoading(false);
        }
      });
    setLoading(false);
  }, [
    closeDeleteConfirmDialog,
    deleteProjectDataLocally,
    selectProject,
    openModal,
  ]);

  // Search and Filter
  const onPageChange = (newPage: number) => {
    setPage(newPage);
    const selectedList = searchKW ? filterList : data?.data;
    updateDisplayList(selectedList, newPage);
  };

  const updateDisplayList = useCallback(
    (dataList: Project[], page: number) => {
      // eslint-disable-next-line no-magic-numbers
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const newList = dataList ? dataList?.slice(startIndex, endIndex) : [];
      setDisplayList(newList);
    },
    [limit]
  );

  useEffect(() => {
    const initialPage = 1;
    if (searchKW) {
      const newFilterList = data?.data?.filter(
        (p: Project) =>
          p.name.toLowerCase().includes(searchKW.toLowerCase()) ||
          p.language.toLowerCase().includes(searchKW.toLowerCase()) ||
          p.description.toLowerCase().includes(searchKW.toLowerCase())
      );
      setPage(initialPage);
      setFilterList(newFilterList);
      updateDisplayList(newFilterList, initialPage);
    } else {
      updateDisplayList(data?.data, initialPage);
    }
  }, [data, searchKW, updateDisplayList]);

  if (error) {
    return <p>An error has occurred.</p>;
  }
  if (!data) {
    return <LoadingSpinner />;
  }
  // if (session && !isAdmin) {
  //   return <AccessDeniedPage />;
  // }

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <main className="relative">
        <div className="container mx-auto p-2.5 pt-5 max-w-screen-xl">
          <section>
            <div className="flex justify-between items-center mb-3">
              <div className="w-50">
                <ProjectSearchBox value={searchKW} setValue={setSearchKW} />
              </div>
              {isAdmin && (
                <Link href="/project/add">
                  <div className="flex text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm px-2.5 py-2.5 sm:px-5 ms-2">
                    <span className="hidden sm:block me-2">New Project</span>
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
            {displayList?.length > 0 ? (
              <>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <Table>
                    <TableHead>
                      <tr>
                        <Tableheader>ID</Tableheader>
                        <Tableheader>Project Name</Tableheader>
                        <Tableheader>Language</Tableheader>
                        <Tableheader>Description</Tableheader>
                        <Tableheader>Start Date</Tableheader>
                        <Tableheader>End Date</Tableheader>
                        <Tableheader>Action</Tableheader>
                      </tr>
                    </TableHead>
                    <tbody>
                      {displayList?.map((p: Project) => (
                        <TableRow
                          key={p.id}
                          className={
                            p.endDate > currentDate
                              ? ''
                              : 'odd:bg-red-100 even:bg-red-100'
                          }
                        >
                          <TableCell>{p.id}</TableCell>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>{p.language}</TableCell>
                          <TableCell>{p.description}</TableCell>
                          <TableCell>
                            <div className="w-20 min-w-fit">
                              {moment(p.startDate).format('YYYY-MM-DD')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="w-20 min-w-fit">
                              {moment(p.endDate).format('YYYY-MM-DD')}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="w-36 min-w-full">
                              <Link
                                href={`/project/${p.id}`}
                                className="font-medium text-blue-50 mr-4 hover:underline hover:text-blue-100"
                              >
                                Detail
                              </Link>
                              {isAdmin && (
                                <>
                                  <Link
                                    href={`/project/${p.id}/edit`}
                                    className="font-medium text-green-600  hover:underline hover:text-green-800"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    type="button"
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onClick={() => onDeleteProjectClick(p)}
                                    className="font-medium text-red-500 ms-4 hover:underline hover:text-red-700"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <InAppPagination
                  page={page}
                  perPage={limit} //limit
                  itemCount={searchKW ? filterList?.length : data?.data?.length}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChangePage={onPageChange}
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
          title={dialogTitle}
          bodyText={dialogBody}
          btnLeftTitle="Cancel"
          btnLeftOnClick={closeDeleteConfirmDialog}
          btnRightTitle="Delete"
          btnRightOnClick={onDeleteProject}
          // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
          onClose={() => {}}
          preformatted
        />
      )}
      {isModalOpen && (
        <ModalDialog
          title={dialogTitle}
          bodyText={dialogBody}
          btnRightTitle="Okay"
          btnRightOnClick={closeModal}
          // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
          onClose={() => {}}
        />
      )}
    </>
  );
};

ProjectList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProjectList;
