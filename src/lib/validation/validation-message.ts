export const requiredErrMsg = (field: string): string => {
  return `${field} is required field`;
};

// Number
export const minErrMsg = (min: number): string => {
  return `Please input a number greater than ${min}`;
};

// Number
export const maxErrMsg = (max: number): string => {
  return `Please input a number less than ${max}`;
};
// String
export const minLenErrMsg = (min: number): string => {
  return `Must be at least ${min} characters`;
};

// String
export const maxLenErrMsg = (max: number): string => {
  return `Cannot more than ${max} characters`;
};

export const emailErrMsg = (): string => {
  return 'Invalid email address';
};

export const dateErrMsg = (field: string): string => {
  return `${field} is invalid date format`;
};
