export interface Project {
  id: number;
  name: string;
  language: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface ProjectNameList {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  password: string;
  photo: string;
  address: string;
  phone: string;
  dob: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  project: {
    id: number;
    name: string;
  };
  // projectName: string;
  // assignedEmployee: string;
  title: string;
  description: string;
  assignedEmployee: {
    id: number;
    name: string;
  };
  estimateHour: number;
  estimateStartDate: string;
  estimateEndDate: string;
  actualHour: number;
  status: number;
  actualStartDate: string;
  actualEndDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Report {
  id: number;
  description: string;
  reportTo: {
    id: number;
    name: string;
  };
  reportBy: {
    id: number;
    name: string;
  };
  date: string;
}

export interface Notification {
  id: number,
  ownerId: number,
  title: string,
  body: string,
  checked: boolean,
  createdAt: string;
}
