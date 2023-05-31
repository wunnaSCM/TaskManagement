/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { Task } from '../models/models';
import Knex from '../../../db/knex';
import { getFormattedCurrentDateTime } from '../format';
import { TASK_STATUS_CLOSE, TASK_STATUS_OPEN } from '../constants';

const formatTaskObject = (task: any): Task => {
  return {
    id: task.id,
    project: {
      id: task.projectId,
      name: task.projectName,
    },
    title: task.title,
    description: task.description,
    assignedEmployee: {
      id: task.employeeId,
      name: task.employeeName,
    },
    estimateHour: task.estimateHour,
    estimateStartDate: task.estimateStartDate,
    estimateEndDate: task.estimateEndDate,
    actualHour: task.actualHour,
    status: task.status,
    actualStartDate: task.actualStartDate,
    actualEndDate: task.actualEndDate,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    deletedAt: task.deletedAt,
  };
};

const getMainQuery = () => {
  return Knex.join('projects', 'tasks.project', '=', 'projects.id')
    .join('employees', 'tasks.assignedEmployee', '=', 'employees.id')
    .select(
      'tasks.id',
      'projects.id AS projectId',
      'projects.name AS projectName',
      'tasks.title',
      'tasks.description',
      'employees.id AS employeeId',
      'employees.name AS employeeName',
      'tasks.estimateHour',
      'tasks.estimateStartDate',
      'tasks.estimateEndDate',
      'tasks.actualHour',
      'tasks.status',
      'tasks.actualStartDate',
      'tasks.actualEndDate',
      'tasks.created_at AS createdAt',
      'tasks.updated_at AS updatedAt'
    )
    .from('tasks');
};

const getSearchQuery = (
  query: any,
  keyword: string,
  status: number,
  ownerId: number
) => {
  return query
    .where((builder: any) => {
      if (keyword) {
        return builder
          .where('tasks.title', 'like', `%${keyword}%`)
          .orWhere('projects.name', 'like', `%${keyword}%`)
          .orWhere('tasks.description', 'like', `%${keyword}%`)
          .orWhere('employees.name', 'like', `%${keyword}%`);
        // .orwhere('tasks.estimateStartDate', 'like', '%' + keyword + '%')
        // .orWhere('tasks.estimateEndDate', 'like', '%' + keyword + '%')
        // .orWhere('tasks.status', 'like', '%' + keyword + '%')
        // .orWhere('tasks.actualStartDate', 'like', '%' + keyword + '%')
        // .orWhere('tasks.actualEndDate', 'like', '%' + keyword + '%');
      }
    })
    .where((builder: any) => filterTaskStatus(builder, status))
    .where((builder: any) => filterOwnTask(builder, ownerId));
};

/**
 * Status Number
 * 0 : Open
 * 1 : In_Progress
 * 2 : Finished
 * 3 : Closed
 * ----------
 * 4 : All
 * 5 : Not_Closed
 */
const filterTaskStatus = (builder: any, status: number) => {
  if (status < 4) {
    return builder.where('tasks.status', status);
  } else if (status === 5) {
    return builder.whereNot('tasks.status', TASK_STATUS_CLOSE);
  }
};

const filterOwnTask = (builder: any, ownerId: number) => {
  if (ownerId > 0) {
    builder.where('tasks.assignedEmployee', ownerId);
  }
};

export async function getTaskList(
  keyword: string,
  offset: number,
  limit: number,
  status: number,
  ownerId: number
): Promise<Task[]> {
  const mainQuery = getMainQuery();
  const searchQuery = getSearchQuery(mainQuery, keyword, status, ownerId);
  const tasks = (await searchQuery
    .orderBy('tasks.id', 'desc')
    .offset(offset)
    .limit(limit)) as object[];

  const formattedTask = tasks.map((t: any) => formatTaskObject(t)) as Task[];
  return formattedTask;
}

export async function getTaskCount(
  keyword: string,
  status: number,
  ownerId: number
): Promise<number> {
  const mainQuery = Knex.join('projects', 'tasks.project', '=', 'projects.id')
    .join('employees', 'tasks.assignedEmployee', '=', 'employees.id')
    .from('tasks');
  const searchQuery = getSearchQuery(mainQuery, keyword, status, ownerId);
  const response = await searchQuery.count('tasks.id');

  const count = response[0]['count(`tasks`.`id`)'];
  return count;
}

export async function getAllTaskIdAndName() {
  const tasks = await Knex.join('projects', 'tasks.project', '=', 'projects.id')
    .select(
      'tasks.id',
      'tasks.title',
      'tasks.status',
      'projects.id AS projectId'
    )
    .from('tasks');
  return tasks;
}

export async function getAllTasksListForExcel(ownerId: number) {
  const mainQuery = getMainQuery();
  const allTasks = (await mainQuery
    .where((builder: any) => filterOwnTask(builder, ownerId))
    .orderBy('tasks.id', 'aesc')) as object[];

  const formattedTask = allTasks.map((t) => formatTaskObject(t)) as Task[];
  return formattedTask;
}

export async function getTaskById(id: number): Promise<Task> {
  const mainQuery = getMainQuery();
  const tasks = (await mainQuery.where('tasks.id', id)) as object[];
  return formatTaskObject(tasks[0]);
}

export async function checkSimilarTaskExist(
  project: string,
  title: string,
  description: string,
  assignedEmployee: string,
  estimateHour: number,
  estimateStartDate: string,
  estimateEndDate: string
): Promise<boolean> {
  try {
    const task = await Knex('tasks').where({
      project: project,
      title: title,
      description: description,
      assignedEmployee: assignedEmployee,
      estimateHour: estimateHour,
      estimateStartDate: estimateStartDate,
      estimateEndDate: estimateEndDate,
    });

    if (task[0]) {
      return true;
    }
    return false;
  } catch (e) {
    console.log('Error:Check Similar Task Exist:', e);
    return false;
  }
}

export async function createTask(
  project: number,
  title: string,
  description: string,
  assignedEmployee: number,
  estimateHour: number,
  estimateStartDate: string,
  estimateEndDate: string
): Promise<number> {
  try {
    const currentDateTime = getFormattedCurrentDateTime();

    const response = await Knex('tasks').insert({
      project: project,
      title: title,
      description: description,
      assignedEmployee: assignedEmployee,
      estimateHour: estimateHour,
      estimateStartDate: estimateStartDate,
      estimateEndDate: estimateEndDate,
      status: TASK_STATUS_OPEN,
      created_at: currentDateTime,
      updated_at: currentDateTime,
    });
    return response;
  } catch (e) {
    console.log('Error:Create Task:', e);
    return 0;
  }
}

export async function updateTaskById(
  id: number,
  project: string,
  title: string,
  description: string,
  assignedEmployee: string,
  estimateHour: number,
  estimateStartDate: string,
  estimateEndDate: string,
  actualHour: number | null,
  status: number,
  actualStartDate: string | null,
  actualEndDate: string | null
): Promise<number> {
  try {
    const response = await Knex('tasks').where({ id: id }).update({
      project: project,
      title: title,
      description: description,
      assignedEmployee: assignedEmployee,
      estimateHour: estimateHour,
      estimateStartDate: estimateStartDate,
      estimateEndDate: estimateEndDate,
      actualHour: actualHour,
      status: status,
      actualStartDate: actualStartDate,
      actualEndDate: actualEndDate,
      updated_at: getFormattedCurrentDateTime(),
    });
    return response;
  } catch (e) {
    console.log('Error:Update Task:', e);
    return 0;
  }
}

export async function deleteTaskById(id: number): Promise<boolean> {
  const response = await Knex('tasks').where({ id: id }).del();
  return response;
}

export async function getTaskByProjectId(
  ProjectId: number,
): Promise<Task[]> {
  const mainQuery = getMainQuery();
  const tasks = (await mainQuery
    .where('projects.id', ProjectId)
  ) as Task[];
  return tasks;
}
