/* eslint-disable no-magic-numbers */
import React, { ReactElement, useCallback, useState } from 'react';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import LoadingSpinner from '@/components/Loading';
import ReactSelect, { ReactSelectOption } from '@/components/ReactSelect';
import { Table, TableHead, Tableheader, TableRow } from '@/components/Table';
import Button from '@/components/Button';
import { PlusIcon } from '@heroicons/react/20/solid';
import TextArea from '@/components/TextArea';
import ModalDialog from '@/components/ModalDialog';
import { TableInput } from '@/components/TableInput';
import TableReactSelect from '@/components/TableReactSelect';
import useSWR from 'swr';
import { POSITION_ADMIN, STATUS_LIST, TYPE_LIST } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { Employee, Project, Task } from '@/lib/models/models';

interface ReportItem {
  id: number;
  taskTitle: string;
  project: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useEmployees(loginUserId: number|null|undefined) {
  const { data, error, isLoading } = useSWR('/api/employees/lists', fetcher);

  const fileterData = data?.data?.filter(
    (e: Employee) => e.position === POSITION_ADMIN && e.id !== loginUserId
  );

  const newData = fileterData?.map((e: Employee) => {
    return {
      value: e.id,
      label: e.name,
    };
  });

  return {
    employeeList: newData,
    isEmployeeLoading: isLoading,
    isEmployeeError: error,
  };
}

function useProjects() {
  const { data, error, isLoading } = useSWR('/api/projects/lists', fetcher);

  return {
    projectList: data?.data,
    isProjectLoading: isLoading,
    isProjectError: error,
  };
}

function useTasks() {
  const { data, error, isLoading } = useSWR('/api/tasks/lists', fetcher);

  const selectBoxList = data?.data?.map((item: Task) => {
    return {
      value: item.id,
      label: item.id,
    };
  });

  return {
    taskList: data?.data,
    taskSelectBoxList: selectBoxList,
    isTaskLoading: isLoading,
    isTaskError: error,
  };
}

const ReportCreate: NextPageWithLayout = () => {
  // Auth User Data from Session
  const { data: session } = useSession();
  // router
  const router = useRouter();

  // Get Initial Data
  const { employeeList, isEmployeeError, isEmployeeLoading } = useEmployees(
    session?.user?.id
  );
  const { projectList, isProjectLoading, isProjectError } = useProjects();
  const { taskList, taskSelectBoxList, isTaskLoading, isTaskError } =
    useTasks();
  const [typeList] = useState<string[]>(TYPE_LIST);
  const [statusList] = useState<string[]>(STATUS_LIST);

  // Input Field Ref
  const [reportList, setReportList] = useState<ReportItem[]>([]);
  const [custormErr, setCustormErr] = useState('');

  // Loading
  const [isLoading, setLoading] = useState(false);
  // Dialog Modal
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogBody, setDialogBody] = useState('');

  // Request Data to Create Report
  const [reqData, setReqData] = useState<{
    description: string;
    reportTo: ReactSelectOption;
  }>();

  // React-hook-form
  const methods = useForm({ mode: 'onTouched' });
  const { register, handleSubmit, setValue, clearErrors } = methods;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFormattedDescription = (data: any): string => {
    const rName = 'Name: ' + session?.user?.name;
    const des = rName + '\n' + reportList[0]?.project + '\n実績';

    const tasks = reportList?.map((r) => {
      const rPercent = data[`report-percentage-${r.id}`];
      const rType = data[`report-type-${r.id}`].value;
      const rStatus = data[`report-status-${r.id}`].value;
      const rHour = data[`report-hour-${r.id}`];

      return `-${r.taskTitle} <${rPercent}%><${rType}><${rStatus}><${rHour}hr>`;
    });

    let taskLines = '';
    tasks.forEach((tl) => {
      taskLines = taskLines + '\n' + tl;
    });
    if (data?.problem) {
      return des + taskLines + '\n所感\n' + data.problem;
    } else {
      return des + taskLines + '\n所感\n-Nothing';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (!reportList.length) {
      setCustormErr('No Report item is added');
      return;
    }
    const newReqData = {
      description: getFormattedDescription(data),
      reportTo: data.reportTo,
    };
    setReqData(newReqData);
    triggerConfirmDialog();
  };

  const triggerConfirmDialog = useCallback(() => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen);
  }, [isConfirmDialogOpen]);

  const onClickCreateConfirm = async () => {
    setLoading(true);
    try {
      const body = {
        description: reqData?.description,
        reportTo: reqData?.reportTo.value,
        reportBy: session?.user?.id,
      };
      await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((json) => {
          setLoading(false);
          if (!json.error) {
            router.push('/report/list');
          }
        });

      setLoading(false);
    } catch (error) {
      const title = 'Something wrong';
      const bodyText = `There was error occur: ${error}`;
      openModal(title, bodyText);
      setLoading(false);
    }
    setLoading(false);
  };

  const onClickAddNewReport = useCallback(() => {
    let newId = 0;
    if (!reportList.length) {
      setCustormErr('');
    } else {
      newId = reportList[reportList.length - 1].id + 1;
    }
    const tempReport: ReportItem = { id: newId, taskTitle: '', project: '' };
    setReportList([...reportList, tempReport]);
  }, [reportList]);

  const onRemoveReportItemClick = useCallback(
    (id: number) => {
      const newList = reportList.filter((rl) => rl.id !== id);
      setReportList(newList);
    },
    [reportList]
  );

  const onChangeReportTaskId = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (id: number, e: any) => {
      const selectedTaskTitle = taskList.filter((t:Task) => t.id === e.value);

      const selectedProject = projectList?.filter(
        (p:Project) => p.id === selectedTaskTitle[0]?.projectId
      );

      const newList = reportList.map((rl) => {
        if (rl.id === id) {
          return {
            id: rl.id,
            taskTitle: selectedTaskTitle[0]?.title,
            project: selectedProject[0]?.name,
          };
        }
        return rl;
      });

      setValue(`report-taskId-${id}`, e);
      clearErrors(`report-taskId-${id}`);
      setReportList(newList);
    },
    [taskList, projectList, reportList, setValue, clearErrors]
  );

  if (isEmployeeError || isProjectError || isTaskError) {
    return <p>An error has occurred.</p>;
  }
  if (isEmployeeLoading || isProjectLoading || isTaskLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <main className="">
        <div className="container mx-auto p-2">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-between mb-2">
                <div className="w-52">
                  <ReactSelect
                    id="reportTo"
                    label="Report To"
                    optionsObject={employeeList}
                    validation={{ required: 'Report To is required field' }}
                    requiredField
                  />
                </div>
                <Button type="submit" className="h-10 mt-7 ms-2 truncate">
                  Create Report
                </Button>
              </div>
              <div className="shadow-md sm:rounded-lg  overflow-x-auto pb-48">
                <div className="h-4/5">
                  <Table>
                    <TableHead>
                      <tr>
                        <Tableheader>No.</Tableheader>
                        <Tableheader>Task ID</Tableheader>
                        <Tableheader>Task Title</Tableheader>
                        <Tableheader>Project</Tableheader>
                        <Tableheader>Percentage</Tableheader>
                        <Tableheader>Type</Tableheader>
                        <Tableheader>Status</Tableheader>
                        <Tableheader>Hour</Tableheader>
                        <Tableheader>Action</Tableheader>
                      </tr>
                    </TableHead>
                    <tbody>
                      {reportList?.map((r: ReportItem) => (
                        <TableRow key={r.id}>
                          <td className="px-4 py-4">{r.id + 1}</td>
                          <td className="px-4 py-4">
                            <TableReactSelect
                              id={`report-taskId-${r.id}`}
                              optionsObject={taskSelectBoxList}
                              validation={{ required: 'required' }}
                              className="w-20"
                              // eslint-disable-next-line react/jsx-no-bind, @typescript-eslint/no-explicit-any
                              onChange={(e:any) => onChangeReportTaskId(r.id, e)}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="w-24">
                              <p>{r?.taskTitle || '-'}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="w-24">
                              <p>{r?.project || '-'}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <TableInput
                              id={`report-percentage-${r.id}`}
                              {...register(`report-percentage-${r.id}`, {
                                required: 'required',
                                min: 0,
                                max: 100,
                                pattern: {
                                  value: /^[1-9]?[0-9]{1}$|^100$/,
                                  message: 'invalid',
                                },
                              })}
                              type="number"
                              className="w-20"
                              addOn="%"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <TableReactSelect
                              id={`report-type-${r.id}`}
                              optionsString={typeList}
                              validation={{ required: 'required' }}
                              className="w-24"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <TableReactSelect
                              id={`report-status-${r.id}`}
                              optionsString={statusList}
                              validation={{ required: 'required' }}
                              className="w-28"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <TableInput
                              id={`report-hour-${r.id}`}
                              {...register(`report-hour-${r.id}`, {
                                required: 'required',
                                pattern: {
                                  value: /^(([0-8])|([0-7]\.?\d)|8.0)$/,
                                  message: 'invalid',
                                },
                              })}
                              className="w-20"
                              addOn="hr"
                            />
                          </td>
                          <td className="px-4 py-4">
                            {reportList.length > 1 ? (
                              <button
                                type="button"
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={() => onRemoveReportItemClick(r.id)}
                                className="font-medium text-red-500 ms-4 hover:underline hover:text-red-700"
                              >
                                Remove
                              </button>
                            ) : (
                              <p className="font-medium text-red-500 ms-4 cursor-not-allowed">
                                Remove
                              </p>
                            )}
                          </td>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="absolute w-11/12 flex justify-center p-3">
                  <div className="flex flex-col items-center">
                    {custormErr && (
                      <div className="text-red-500 my-4">
                        <p>
                          {'* '}
                          {custormErr}
                        </p>
                      </div>
                    )}
                    <Button
                      type="button"
                      className="flex w-24 justify-center"
                      onClick={onClickAddNewReport}
                    >
                      <>
                        <span>Add</span>
                        <PlusIcon className="w-5 h-5 stroke-2 ms-2" />
                      </>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="max-w-md mt-4">
                <TextArea
                  id="problem"
                  label="Problem/Feeling"
                  placeholder="Enter your project language"
                  validation={{ maxLength: 100 }}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
      {isLoading && <LoadingSpinner />}
      {isConfirmDialogOpen && (
        <ModalDialog
          title="Report Create"
          bodyText={
            'Report To: ' +
            reqData?.reportTo?.label +
            '\n\n' +
            reqData?.description
          }
          btnLeftTitle="Cancel"
          btnLeftOnClick={triggerConfirmDialog}
          btnRightTitle="Create"
          // eslint-disable-next-line react/jsx-no-bind
          btnRightOnClick={onClickCreateConfirm}
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

ReportCreate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ReportCreate;
