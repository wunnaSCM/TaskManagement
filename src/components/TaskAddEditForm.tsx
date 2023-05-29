/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
import React, { useCallback, useEffect, useState } from 'react';
import Card from '@/components/Card';
import { FormProvider, useForm } from 'react-hook-form';
import Input from '@/components/Input';
import DateTimePicker from './DateTimePicker';
import Button from '@/components/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/Loading';
import ModalDialog from '@/components/ModalDialog';
import ReactSelect, { ReactSelectOption } from './ReactSelect';
import { useSession } from 'next-auth/react';
import { POSITION_ADMIN } from '@/lib/constants';
import { Employee, Project } from '@/lib/models/models';
import { taskCreateSchema, taskUpdateSchema } from '@/lib/validation/task';

const statusList = [
  { value: '0', label: 'Open' },
  { value: '1', label: 'In Progress' },
  { value: '2', label: 'Finish' },
  { value: '3', label: 'Close' },
];

export default function TaskAddEditForm({ editForm }: { editForm?: boolean }) {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  // Routeer
  const router = useRouter();
  // Loading
  const [isLoading, setLoading] = useState(false);
  // Dialog Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogBody, setDialogBody] = useState('');
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  //Project id,name DataList
  const [projectList, setProjectList] = useState<ReactSelectOption[]>([]);

  //Employee id,name DataList
  const [employeeList, setEmployeeList] = useState<ReactSelectOption[]>([]);

  // Estimate/Actual Time
  const [estimateStartTime, setEstimateStartTime] = useState<string | Date>();
  const [estimateEndTime, setEstimateEndTime] = useState<string | Date>();
  const [actualStartTime, setActualStartTime] = useState<string | Date>();
  const [actualEndTime, setActualEndTime] = useState<string | Date>();
  const [projectStartDate, setProjectStartDate] = useState<string | Date>();
  const [projectEndDate, setProjectEndDate] = useState<string | Date>();

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(editForm ? taskUpdateSchema : taskCreateSchema),
  });
  const { handleSubmit, setValue, clearErrors } = methods;

  const getProjectData = async () => {
    try {
      await fetch('/api/projects/lists')
        .then((res) => res.json())
        .then((json) => {
          if (json?.data !== undefined) {
            const newList = json.data.map((e: Project) => ({
              value: e.id,
              label: e.name,
            }));

            setProjectList(newList);
          }
        });
    } catch (error) {
      //
    }
  };

  const getEmployeeData = async () => {
    try {
      await fetch('/api/employees/lists')
        .then((res) => res.json())
        .then((json) => {
          if (json?.data !== undefined) {
            const newList = json.data.map((e: Employee) => ({
              value: e.id,
              label: e.name,
            }));

            setEmployeeList(newList);
          }
        });
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getProjectData();
    getEmployeeData();
  }, []);

  const closeUpdateModal = useCallback(() => {
    setIsUpdateSuccess(false);
  }, [setIsUpdateSuccess]);

  const openUpdateModal = useCallback(() => {
    setIsUpdateSuccess(true);
  }, [setIsUpdateSuccess]);

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

  const onChangeProjectSelect = async (e: any) => {
    setValue('project', e);
    const pId = e.value;
    const p = await fetch(`/api/projects/${pId}`)
      .then((res) => res.json())
      .then((res) => res?.data);
    setProjectStartDate(new Date(p.startDate));
    setProjectEndDate(new Date(p.endDate));
  };

  // Check if the given date is a Saturday, Sunday, or public holiday
  function isNonWorkingDay(date: moment.Moment) {
    const dayOfWeek = moment(date).day();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) and Saturday (6)
  }

  // Calculate the working hours between two given dates
  const calculateWorkingHours = useCallback(
    (startDateTime: string | Date, endDateTime: string | Date) => {
      const start = moment(startDateTime);
      const end = moment(endDateTime);

      let totalWorkingMinutes = 0;

      // Iterate over each day between start and end dates
      for (
        let date = start.clone();
        date.isSameOrBefore(end, 'day');
        date.add(1, 'day')
      ) {
        const isStartDay = date.isSame(start, 'day');
        const isEndDay = date.isSame(end, 'day');
        const isNonWorking = isNonWorkingDay(date);

        const startTime = isStartDay ? start : date.clone().hour(8);
        const endTime = isEndDay ? end : date.clone().hour(17);

        const diffInMinutes = endTime.diff(startTime, 'minutes');

        if (!isNonWorking) {
          const isStartTimeBefore13 = startTime.isBefore(date.clone().hour(13));
          const isTimeExceedingNoon = endTime.isAfter(date.clone().hour(12));
          const isTimeExceeding13 = endTime.isSameOrAfter(
            date.clone().hour(13)
          );
          const noon = date.clone().hour(12);

          if (isStartTimeBefore13) {
            totalWorkingMinutes += isTimeExceedingNoon
              ? isTimeExceeding13
                ? diffInMinutes - 60
                : noon.diff(startTime, 'minutes')
              : diffInMinutes;
          } else {
            totalWorkingMinutes += diffInMinutes;
          }
        }
      }

      return (totalWorkingMinutes / 60).toFixed(1);
    },
    []
  );

  const getFormattDatetime = (date: string): string => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setLoading(true);
    // Change Date Format
    data.estimateStartDate = getFormattDatetime(data.estimateStartDate);
    data.estimateEndDate = getFormattDatetime(data.estimateEndDate);
    data.actualStartDate = data.actualStartDate
      ? getFormattDatetime(data.actualStartDate)
      : null;
    data.actualEndDate = data.actualEndDate
      ? getFormattDatetime(data.actualEndDate)
      : null;
    data.actualHour = data.actualHour ? data.actualHour : null;
    data.project = data.project.value;
    data.assignedEmployee = data.assignedEmployee.value;

    try {
      if (!editForm) {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((json) => {
            setLoading(false);
            if (!json.error) {
              if (json.data) {
                router.push('/task/list');
              }
            } else {
              const title = json.error.toString();
              const bodyText = `Error: ${json.error.toString()}`;
              openModal(title, bodyText);
            }
          });
      } else {
        data.status = data.status.value;
        await fetch('/api/tasks/' + router.query.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((json) => {
            setLoading(false);
            if (!json.error) {
              openUpdateModal();
            } else {
              const title = json.error.toString();
              const bodyText = `Error: ${json.error.toString()}`;
              openModal(title, bodyText);
            }
          });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const title = 'Something wrong';
      const bodyText = `There was error occur: ${error}`;
      openModal(title, bodyText);
    }
    setLoading(false);
  };

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const getTaskDataById = useCallback(
    async (id: number) => {
      await fetch('/api/tasks/' + id)
        .then((res) => res.json())
        .then((json) => {
          const pp = json.data;
          pp.estimateStartDate = new Date(pp?.estimateStartDate);
          pp.estimateEndDate = new Date(pp?.estimateEndDate);

          pp.actualStartDate =
            pp?.actualStartDate !== null ? new Date(pp?.actualStartDate) : null;
          pp.actualEndDate =
            pp?.actualEndDate !== null ? new Date(pp?.actualEndDate) : null;

          pp.project = {
            value: pp.project.id,
            label: pp.project.name,
          };

          pp.assignedEmployee = {
            value: pp.assignedEmployee.id,
            label: pp.assignedEmployee.name,
          };

          pp.status = statusList[pp.status];

          setEstimateStartTime(pp.estimateStartDate);
          setEstimateEndTime(pp.estimateEndDate);
          setActualStartTime(pp.actualStartDate);
          setActualEndTime(pp.actualEndDate);

          for (const [key, value] of Object.entries(pp)) {
            setValue(key, value);
          }
        });
    },
    [setValue]
  );

  useEffect(() => {
    if (editForm && router.query.id !== undefined) {
      const id = parseInt(router.query.id as string);
      if (id) {
        getTaskDataById(id);
      }
    }
  }, [router, editForm, getTaskDataById]);

  useEffect(() => {
    if (estimateStartTime && estimateEndTime) {
      const ah = calculateWorkingHours(estimateStartTime, estimateEndTime);
      setValue('estimateHour', ah);
      clearErrors('estimateHour');
    }
  }, [
    estimateStartTime,
    estimateEndTime,
    calculateWorkingHours,
    setValue,
    clearErrors,
  ]);

  useEffect(() => {
    if (actualStartTime && actualEndTime) {
      const ah = calculateWorkingHours(actualStartTime, actualEndTime);
      setValue('actualHour', ah);
      clearErrors('actualHour');
    }
  }, [
    actualStartTime,
    actualEndTime,
    calculateWorkingHours,
    setValue,
    clearErrors,
  ]);

  if (!(projectList.length > 0) && !(employeeList.length > 0)) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <div className="container sm:w-8/12 md:w-7/12 lg:w-5/12 mx-auto p-2">
        <Card title={editForm ? 'Task Update Form' : 'Task Create Form'}>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ReactSelect
                  id="project"
                  label="Project"
                  optionsObject={projectList}
                  placeholder="Select Project"
                  disabled={!isAdmin}
                  onChange={onChangeProjectSelect}
                  requiredField
                />
                <Input
                  id="title"
                  label="Title"
                  placeholder="Enter your title"
                  readOnly={!isAdmin}
                  requiredField
                />
                <Input
                  id="description"
                  label="Description"
                  placeholder="Enter description"
                  readOnly={!isAdmin}
                  requiredField
                />
                <ReactSelect
                  id="assignedEmployee"
                  label="Assigned Employee"
                  optionsObject={employeeList}
                  placeholder="Select Employee"
                  disabled={!isAdmin}
                  requiredField
                />
                <DateTimePicker
                  id="estimateStartDate"
                  label="Estimate Start Date"
                  placeholder="YYYY-MM-DD h:mm"
                  onChange={(d: Date) => {
                    setEstimateStartTime(d);
                    setValue('estimateStartDate', d);
                    clearErrors('estimateStartDate');
                    clearErrors('estimateEndDate');
                  }}
                  readOnly={!isAdmin}
                  minDate={projectStartDate}
                  maxDate={projectEndDate}
                  requiredField
                />
                <DateTimePicker
                  id="estimateEndDate"
                  label="Estimate End Date"
                  placeholder="YYYY-MM-DD h:mm"
                  onChange={(d: Date) => {
                    setEstimateEndTime(d);
                    setValue('estimateEndDate', d);
                    clearErrors('estimateEndDate');
                  }}
                  readOnly={!isAdmin}
                  requiredField
                  minDate={
                    estimateStartTime ? estimateStartTime : projectStartDate
                  }
                  maxDate={projectEndDate}
                />
                <Input
                  id="estimateHour"
                  label="Estimate Hour"
                  placeholder="Estimate Hour"
                  readOnly
                  requiredField
                />
                {editForm && (
                  <>
                    <ReactSelect
                      id="status"
                      label="Select Status"
                      optionsObject={statusList}
                      requiredField
                    />
                    <DateTimePicker
                      id="actualStartDate"
                      label="Actual Start Date"
                      placeholder="YYYY-MM-DD h:mm"
                      onChange={(d: Date) => {
                        setActualStartTime(d);
                        setValue('actualStartDate', d);
                        clearErrors('actualStartDate');
                        clearErrors('actualEndDate');
                      }}
                      minDate={projectStartDate}
                      maxDate={projectEndDate}
                      requiredField
                    />
                    <DateTimePicker
                      id="actualEndDate"
                      label="Actual End Date"
                      placeholder="YYYY-MM-DD h:mm"
                      onChange={(d: Date) => {
                        setActualEndTime(d);
                        setValue('actualEndDate', d);
                        clearErrors('actualEndDate');
                      }}
                      requiredField
                      minDate={
                        actualStartTime ? actualStartTime : projectStartDate
                      }
                      maxDate={projectEndDate}
                    />
                    <Input
                      id="actualHour"
                      label="Actual Hour"
                      placeholder="Assigned Employee"
                      readOnly
                      requiredField
                    />
                  </>
                )}
                <div className="flex justify-between mt-10">
                  <Button
                    type="button"
                    secondary
                    onClick={goBack}
                    className="w-40"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-40 ms-2">
                    {editForm ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </Card>
      </div>
      {isLoading && <LoadingSpinner />}
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
      {isUpdateSuccess && (
        <ModalDialog
          title="Success!"
          bodyText="Task is updated successfully."
          btnRightTitle="OK"
          btnRightOnClick={() => {
            closeUpdateModal();
            router.push('/task/list');
          }}
          // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
          onClose={() => {}}
        />
      )}
    </main>
  );
}
