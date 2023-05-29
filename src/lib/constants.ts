/* eslint-disable no-magic-numbers */
export const RESET_PASSWORD_EXPIRED_TIME = 20 * 60 * 1000; // 20min

export const RESET_TOKEN_LENGTH = 60;

export const TYPE_LIST = [
  'CD',
  'UT',
  'Test',
  'BugFix',
  'Review',
  'Learn',
  'Meeting',
  'Doc',
  'Leave',
];

export const STATUS_LIST = ['Open', 'In Progress', 'Finish', 'Close'];

export const POSITION_ADMIN = 0;
export const POSITION_USER = 1;

export const TASK_STATUS_OPEN = 0;
export const TASK_STATUS_IN_PROGRESS = 1;
export const TASK_STATUS_FINISH = 2;
export const TASK_STATUS_CLOSE = 3;
