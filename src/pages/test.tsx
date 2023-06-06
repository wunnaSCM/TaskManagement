import moment from 'moment';
import React from 'react';

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

  const year = 2023;
  const month = 5; // Note: January is month 0, February is month 1, and so on

  const weekdaysInMonth = getWeekdaysInMonth(year, month);

  weekdaysInMonth.forEach((weekday) => {
    console.log('test', weekday.format('YYYY-MM-DD'));
  });
}
