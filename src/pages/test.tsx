import React, { useState } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

export default function Test() {
  function getWeekdaysInMonth(year, month) {
    const startDate = moment({ year, month }).startOf('month');
    const endDate = moment({ year, month }).endOf('month');
    const weekdays = [];

    let currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
      if (currentDate.isoWeekday() <= 5) {
        weekdays.push(currentDate.clone());
      }
      currentDate.add(1, 'day');
    }

    return weekdays;
  }

  function getSaturdaysAndSundaysOfMonth(year, month) {
    const startDate = moment({ year, month, day: 1 });
    const endDate = startDate.clone().endOf('month');
    const result = [];

    let currentDate = startDate.clone().startOf('week');

    while (currentDate.isSameOrBefore(endDate)) {
      if (currentDate.day() === 0 || currentDate.day() === 6) {
        result.push(currentDate.clone());
      }
      currentDate.add(1, 'day');
    }

    return result;
  }

  function countWeekdays(startDate, endDate) {
    let currentDate = moment(startDate);
    const targetDate = moment(endDate);
    let count = 0;

    while (currentDate.isSameOrBefore(targetDate)) {
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        count++;
      }
      currentDate.add(1, 'day');
    }

    return count;
  }

  // const startDate = '2023-05-18';
  // const endDate = '2023-08-16';
  // const weekdaysCount = countWeekdays(startDate, endDate);

  // console.log('Number of weekdays:', weekdaysCount);

  // const year = 2023;
  // const month = 5; // Note: January is month 0, February is month 1, and so on

  // const weekdaysInMonth = getSaturdaysAndSundaysOfMonth(year, month);

  // weekdaysInMonth.forEach((weekday) => {
  //   // console.log('test', weekday.format('YYYY-MM-DD'));
  // });

  const [startDate, setStartDate] = useState(1659312000000);
  console.log('startDate', startDate);

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="MM/yyyy"
        // excludeDates={[
        //   1661990400000, 1664582400000, 1667260800000, 1672531200000,
        // ]}
        showMonthYearPicker
      />
    </div>
  );
}
