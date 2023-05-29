/* eslint-disable no-magic-numbers */
import { ArrowUpCircleIcon } from '@heroicons/react/20/solid';
import React, { useCallback, useRef, useState } from 'react';
import ModalDialog from './ModalDialog';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/router';
import { Employee, Project } from '@/lib/models/models';
import { taskUpdateServerSchema } from '@/lib/validation/task-server';

export default function TaskExcelFileImport() {
  const router = useRouter();
  const excelFileRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogBody, setDialogBody] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const closeConfirmToUploadExcel = useCallback(() => {
    setIsConfirmDialogOpen(false);
  }, [setIsConfirmDialogOpen]);

  const openConfirmToUploadExcel = useCallback(() => {
    setIsConfirmDialogOpen(true);
  }, [setIsConfirmDialogOpen]);

  const closeSuccessUploadExcel = useCallback(() => {
    setIsSuccessDialogOpen(false);
  }, [setIsSuccessDialogOpen]);

  const openSuccessUploadExcel = useCallback(() => {
    setIsSuccessDialogOpen(true);
  }, [setIsSuccessDialogOpen]);

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

  const uploadToExcelFromDialog = useCallback(() => {
    if (excelFileRef.current) {
      excelFileRef.current.click();
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const readExcelFileAndUploadData = (file: File) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileReader.onload = (e: any) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, {
          type: 'buffer',
        });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        // setExcelItems(data);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    promise.then((d: any) => {
      uploadExcelData(d);
    });
  };

  const getProjectIdList = async () => {
    const list = await fetch('/api/projects/lists')
      .then((res) => res.json())
      .then((json) => json.data);
    return list?.map((p: Project) => p.id);
  };

  const getEmployeeIdList = async () => {
    const list = await fetch('/api/employees/lists')
      .then((res) => res.json())
      .then((json) => json.data);
    return list?.map((e: Employee) => e.id);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadExcelData = async (excelData: any) => {
    const projectIds = (await getProjectIdList()) as number[];
    const employeeIds = (await getEmployeeIdList()) as number[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedExcelData = excelData?.map((item: any) => {
      const formatStatusTxt = item.Status
        ? item.Status.replace(' ', '').replace('_', '').toLowerCase()
        : null;
      const status =
        formatStatusTxt === 'open'
          ? 0
          : formatStatusTxt === 'inprogress'
            ? 1
            : formatStatusTxt === 'finish'
              ? 2
              : formatStatusTxt === 'close'
                ? 3
                : 4;

      return {
        id: item.Id,
        project: parseInt(item.ProjectId),
        title: item.Title,
        description: item.Description,
        assignedEmployee: parseInt(item.AssignedEmployeeId),
        estimateHour: parseFloat(item.EstimateHour),
        estimateStartDate: item.EstimateStartDate,
        estimateEndDate: item.EstimateEndDate,
        actualHour: item.ActualHour ? parseFloat(item.ActualHour) : null,
        status: status,
        actualStartDate: item.ActualStartDate ?? null,
        actualEndDate: item.ActualEndDate ?? null,
      };
    });

    const invalidData = [];
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formattedExcelData.map(async (item: any) => {
        const isRelatedIdValid =
          projectIds.includes(item.project) &&
          employeeIds.includes(item.assignedEmployee);

        if (!isRelatedIdValid) {
          invalidData.push(item);
        } else {
          try {
            const isIdExist = item?.id
              ? await fetch(`/api/tasks/${item.id}`)
                .then((res) => res.json())
                .then((json) => json.data)
              : true;

            if (!isIdExist) {
              invalidData.push(item);
            } else {
              const isFieldValid = await taskUpdateServerSchema.validate(item);
              if (!isFieldValid) {
                invalidData.push(item);
              }
            }
          } catch (error) {
            invalidData.push(item);
          }
        }
      })
    );
    if (invalidData?.length > 0) {
      const title = 'Fail to upload your excel file!';
      const bodyText =
        'Task List excel file include invalid data. Please check and correct data in file and upload again.';
      openModal(title, bodyText);
    } else {
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formattedExcelData.map(async (item: any) => {
          if (item.id) {
            await fetch(`/api/tasks/${item.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(item),
            });
          } else {
            await fetch('/api/tasks', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(item),
            });
          }
          openSuccessUploadExcel();
        })
      );
    }
  };

  return (
    <>
      <div
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => openConfirmToUploadExcel()}
        className="flex w-full h-full p-0 sm:w-fit  lg:w-44 self-center justify-center text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm px-2.5 py-2.5 sm:ms-2"
      >
        <div className="flex ">
          <span className="sm:hidden lg:block me-2">Upload</span>
          <ArrowUpCircleIcon className="w-5 h-5 text-white " />
          <input
            id="excelUpload"
            type="file"
            ref={excelFileRef}
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/jsx-no-bind
            onChange={(e: any) => {
              closeConfirmToUploadExcel();
              if (e.target.files) {
                const excelFile = e.target.files[0];
                readExcelFileAndUploadData(excelFile);
              }
            }}
            hidden
          />
        </div>
      </div>
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

      {isSuccessDialogOpen && (
        <ModalDialog
          title={'Uploaded your excel file successfully!'}
          bodyText={'Task List excel file is uploaded. Please check in list.'}
          btnRightTitle="Okay"
          // eslint-disable-next-line react/jsx-no-bind
          btnRightOnClick={() => {
            closeSuccessUploadExcel();
            router.reload();
          }}
          // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
          onClose={() => {}}
        />
      )}
      {isConfirmDialogOpen && (
        <ModalDialog
          title="Uploading Excel File"
          bodyText="Create and update task list with uploaded excel file."
          btnLeftTitle="Cancel"
          btnLeftOnClick={closeConfirmToUploadExcel}
          btnRightTitle="Upload"
          // eslint-disable-next-line react/jsx-no-bind
          btnRightOnClick={() => {
            uploadToExcelFromDialog();
          }}
          // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
          onClose={() => {}}
        />
      )}
    </>
  );
}
