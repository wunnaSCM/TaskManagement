/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import moment from 'moment';
import { useRouter } from 'next/router';

export default function ReportSearchBox({
  reportTo,
  reportBy,
  date,
}: {
  reportTo?: string;
  reportBy?: string;
  date?: string;
}) {
  const router = useRouter();
  const [kwReportTo, setKwReportTo] = useState(reportTo ? reportTo : '');
  const [kwReportBy, setKwReportBy] = useState(reportBy ? reportBy : '');
  const [kwDate, setKwDate] = useState(date);
  const [openDP, setOpenDP] = useState(false);

  const toggleDP = () => {
    setOpenDP(!openDP);
  };

  return (
    <div className="10/12">
      <form>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
          <div className="flex items-center justify-between sm:justify-start sm:ms-2">
            <label
              htmlFor="reportTo"
              className="block me-3 text-sm font-medium text-primary"
            >
              Report To
            </label>

            <div className="flex justify-between border-gray-300 bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5">
              <input
                id="reportTo"
                name="reportTo"
                value={kwReportTo}
                onChange={(e) => setKwReportTo(e.target.value)}
                type="text"
                className="sm:w-16 md:w-full bg-transparent focus:outline-none "
                placeholder=""
                aria-describedby="reportTo"
              />
              {kwReportTo && (
                <XMarkIcon
                  className="w-5 h-5 fill-gray-600 ms-2 cursor-pointer"
                  onClick={() => {
                    const newRoute = router.asPath.replace(
                      `reportTo=${kwReportTo}`,
                      'reportTo='
                    );
                    setKwReportTo('');
                    router.push(newRoute);
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-start sm:ms-2">
            <label
              htmlFor="reportBy"
              className="block me-3 text-sm font-medium text-primary"
            >
              Report By
            </label>

            <div className="flex justify-between border-gray-300 bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5">
              <input
                id="reportBy"
                name="reportBy"
                value={kwReportBy}
                onChange={(e) => setKwReportBy(e.target.value)}
                type="text"
                className="sm:w-16 md:w-full bg-transparent focus:outline-none "
                placeholder=""
                aria-describedby="reportBy"
              />
              {kwReportBy && (
                <XMarkIcon
                  className="w-5 h-5 fill-gray-600 ms-2 cursor-pointer"
                  onClick={() => {
                    const newRoute = router.asPath.replace(
                      `reportBy=${kwReportBy}`,
                      'reportBy='
                    );
                    setKwReportBy('');
                    router.push(newRoute);
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-start sm:ms-2">
            <label
              htmlFor="reportTo"
              className="block me-3 text-sm font-medium text-primary"
            >
              Date
            </label>
            <div className="flex justify-between border-gray-300 bg-gray-50 border text-gray-900 text-sm rounded-lg p-2.5">
              <div>
                <ReactDatePicker
                  onChange={(e) => {
                    setKwDate(moment(e).format('YYYY-MM-DD'));
                    toggleDP();
                  }}
                  placeholderText="YYYY-MM-DD"
                  aria-describedby="date"
                  showMonthDropdown
                  showYearDropdown
                  open={openDP}
                  dropdownMode="select"
                  openToDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="bg-red-500 w-0"
                  calendarContainer={CustomDPContainer}
                />
              </div>
              <div onClick={toggleDP} className="cursor-pointer">
                <p className="w-40 sm:w-20">{kwDate}</p>
                <input
                  id="date"
                  name="date"
                  value={kwDate}
                  readOnly={true}
                  hidden
                  type="text"
                  className="sm:w-16 md:w-full bg-transparent focus:outline-none cursor-pointer"
                  placeholder="YYYY-MM-DD"
                  aria-describedby="date"
                />
              </div>
              {kwDate && (
                <XMarkIcon
                  className="w-5 h-5 fill-gray-600 ms-2 cursor-pointer"
                  onClick={() => {
                    const newRoute = router.asPath.replace(
                      `date=${kwDate}`,
                      'date='
                    );
                    setKwDate('');
                    router.push(newRoute);
                  }}
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="p-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark sm:ms-2"
          >
            <div className="flex justify-center">
              <span className="me-2 sm:hidden">Search</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}

const CustomDPContainer = ({
  className,
  children,
}: {
  className: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}) => {
  return (
    <div>
      <CalendarContainer className={className}>
        <div style={{ position: 'relative' }}>{children}</div>
      </CalendarContainer>
    </div>
  );
};
