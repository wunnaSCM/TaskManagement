/* eslint-disable no-magic-numbers */
/* eslint-disable indent */
import React, { useCallback, useState } from 'react';
import saveAs from 'file-saver';
import moment from 'moment';
import { POSITION_ADMIN } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import * as XLSX from 'xlsx';
import { ArrowDownCircleIcon } from '@heroicons/react/20/solid';
import ModalDialog from './ModalDialog';

export default function TaskExcelFileExport() {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  const userId = session?.user?.id;

  const [isDowloadSuccess, setIsDowloadSuccess] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const closeDownloadModal = useCallback(() => {
    setIsDowloadSuccess(false);
  }, [setIsDowloadSuccess]);

  const openDownloadModal = useCallback(() => {
    setIsDowloadSuccess(true);
  }, [setIsDowloadSuccess]);

  const closeConfirmToDownloadExcel = useCallback(() => {
    setIsConfirmDialogOpen(false);
  }, [setIsConfirmDialogOpen]);

  const openConfirmToDownloadExcel = useCallback(() => {
    setIsConfirmDialogOpen(true);
  }, [setIsConfirmDialogOpen]);

  const exportTasks = async () => {
    closeConfirmToDownloadExcel();
    try {
      const allTaskList = await fetch(
        '/api/tasks/all' + (isAdmin ? '' : `?userId=${userId}`)
      )
        .then((res) => res.json())
        .then((json) => json.data);

      const formattedDataTask =
        allTaskList?.length > 0
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            allTaskList?.map((item: any) => {
              const sts =
                item.status === 0
                  ? 'Open'
                  : item.status === 1
                  ? 'In Progress'
                  : item.status === 2
                  ? 'Finish'
                  : item.status === 3
                  ? 'Close'
                  : '-';
              return {
                Id: item.id,
                Title: item.title,
                ProjectId: item.project.id,
                ProjectName: item.project.name,
                Description: item.description,
                AssignedEmployeeId: item.assignedEmployee.id,
                AssignedEmployeeName: item.assignedEmployee.name,
                EstimateStartDate: moment(item.estimateStartDate).format(
                  'YYYY-MM-DD HH:mm:ss'
                ),
                EstimateEndDate: moment(item.estimateEndDate).format(
                  'YYYY-MM-DD HH:mm:ss'
                ),
                EstimateHour: item.estimateHour,
                Status: sts,
                ActualStartDate: item.actualStartDate
                  ? moment(item.actualStartDate).format('YYYY-MM-DD HH:mm:ss')
                  : null,
                ActualEndDate: item.actualEndDate
                  ? moment(item.actualEndDate).format('YYYY-MM-DD HH:mm:ss')
                  : null,
                ActualHour: item.actualHour,
                CreatedAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                UpdatedAt: moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
              };
            })
          : [
              // Blank Array
              {
                Id: '',
                Title: '',
                ProjectId: '',
                ProjectName: '',
                Description: '',
                AssignedEmployeeId: '',
                AssignedEmployeeName: '',
                EmployeeName: '',
                EstimateStartDate: '',
                EstimateEndDate: '',
                EstimateHour: '',
                Status: '',
                ActualStartDate: '',
                ActualEndDate: '',
                ActualHour: '',
                CreatedAt: '',
                UpdatedAt: '',
              },
            ];
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedDataTask);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

      // Generate the Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      // Save the file using FileSaver.js
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const currentDate = Date.now();
      const formattedDate = moment(currentDate).format('YYYY-MM-DD-HH:mm:ss');
      saveAs(blob, `${formattedDate + 'Task'}.xlsx`);
      openDownloadModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex ">
        <button
          type="button"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => openConfirmToDownloadExcel()}
          className="flex w-full h-full p-0 sm:w-fit  lg:w-44 self-center justify-center text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm px-2.5 py-2.5 sm:ms-2"
        >
          <span className="sm:hidden lg:block me-2">Download</span>
          <ArrowDownCircleIcon className="w-5 h-5 text-white " />
        </button>
      </div>
      {isDowloadSuccess && (
        <ModalDialog
          title="Downloaded successfully!"
          bodyText="Task List excel file is downloaded. Please check in your download folder."
          btnRightTitle="OK"
          btnRightOnClick={closeDownloadModal}
          // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
          onClose={() => {}}
        />
      )}
      {isConfirmDialogOpen && (
        <ModalDialog
          title="Download Excel File"
          bodyText="Task list will be downloaded as excel file."
          btnLeftTitle="Cancel"
          btnLeftOnClick={closeConfirmToDownloadExcel}
          btnRightTitle="Download"
          // eslint-disable-next-line react/jsx-no-bind
          btnRightOnClick={() => {
            exportTasks();
          }}
          // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
          onClose={() => {}}
        />
      )}
    </>
  );
}
