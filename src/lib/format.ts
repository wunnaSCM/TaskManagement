import moment from 'moment';

export const getFormattedCurrentDate = (): string => {
  return moment().format('YYYY-MM-DD');
};

export const getFormattedCurrentDateTime = (): string => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

export const getSubtractedDate = (day:number): string => {
  return moment().subtract(day, 'days').format('YYYY-MM-DD HH:mm:ss');
};