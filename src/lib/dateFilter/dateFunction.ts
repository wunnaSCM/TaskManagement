import moment from 'moment';

export function getMonthNames(startDate, endDate) {
  const start = moment(startDate);
  const end = moment(endDate);

  const monthNames = [];
  while (start.isSameOrBefore(end, 'month')) {
    monthNames.push({
      value: Math.floor(Math.random() * 100),
      label: start.format('MMMM'),
    });
    start.add(1, 'month');
  }

  return monthNames;
}

export function getMonthRange(month, year) {
  const monthObj = moment(month, 'MMMM');
  const startDate = monthObj.clone().startOf('month');
  const endDate = monthObj.endOf('month');
  const yearObj = monthObj.clone().startOf('year');
  const a = yearObj.format(year);
  return {
    start: startDate.format(`${a}-MM-DD`), // Format the start date as desired
    end: endDate.format(`${a}-MM-DD`), // Format the end date as desired
  };
}

export function countWeekdays(startDate, endDate) {
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