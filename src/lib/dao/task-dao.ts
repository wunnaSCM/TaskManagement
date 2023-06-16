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
    type: task.type,
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
    assignedEmployeePercent: task.assignedEmployeePercent,
    reviewer: {
      id: task.reviewId,
      name: task.reviewName,
    },
    reviewEstimateHour: task.reviewEstimateHour,
    reviewEstimateStartDate: task.reviewEstimateStartDate,
    reviewEstimateEndDate: task.reviewEstimateEndDate,
    reviewActualHour: task.reviewActualHour,
    reviewActualStartDate: task.reviewActualStartDate,
    reviewActualEndDate: task.reviewActualEndDate,
    reviewerPercent: task.reviewerPercent,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    deletedAt: task.deletedAt,
  };
};

const getMainQuery = () => {
  return Knex.join('projects', 'tasks.project', '=', 'projects.id')
    .join('employees AS assign', 'tasks.assignedEmployee', '=', 'assign.id')
    .join('employees AS review', 'tasks.reviewer', '=', 'review.id')
    .select(
      'tasks.id',
      'projects.id AS projectId',
      'projects.name AS projectName',
      'tasks.type',
      'tasks.title',
      'tasks.description',
      'assign.id AS employeeId',
      'assign.name AS employeeName',
      'tasks.estimateHour',
      'tasks.estimateStartDate',
      'tasks.estimateEndDate',
      'tasks.actualHour',
      'tasks.status',
      'tasks.actualStartDate',
      'tasks.actualEndDate',
      'tasks.assignedEmployeePercent',
      'review.id AS reviewId',
      'review.name AS reviewName',
      'tasks.reviewEstimateHour',
      'tasks.reviewEstimateStartDate',
      'tasks.reviewEstimateEndDate',
      'tasks.reviewActualHour',
      'tasks.reviewActualStartDate',
      'tasks.reviewActualEndDate',
      'tasks.reviewerPercent',
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
 * 4  : Review
 * ----------
 * -1 : All
 * 5 : Not_Closed
 */
const filterTaskStatus = (builder: any, status: number) => {
  console.log('status', status);
  if (status >= 0 && status <= 4) {
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
  console.log('tasks', tasks);
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
  type: any,
  title: string,
  description: string,
  assignedEmployee: number,
  estimateHour: number,
  estimateStartDate: string,
  estimateEndDate: string,
  reviewer: number,
  reviewEstimateHour: number,
  reviewEstimateStartDate: string,
  reviewEstimateEndDate: string,
): Promise<number> {
  try {
    const currentDateTime = getFormattedCurrentDateTime();

    const response = await Knex('tasks').insert({
      project: project,
      type: type,
      title: title,
      description: description,
      assignedEmployee: assignedEmployee,
      estimateHour: estimateHour,
      estimateStartDate: estimateStartDate,
      estimateEndDate: estimateEndDate,
      status: TASK_STATUS_OPEN,
      reviewer: reviewer,
      reviewEstimateHour: reviewEstimateHour,
      reviewEstimateStartDate: reviewEstimateStartDate,
      reviewEstimateEndDate: reviewEstimateEndDate,
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
  type: any,
  title: string,
  description: string,
  assignedEmployee: string,
  estimateHour: number,
  estimateStartDate: string,
  estimateEndDate: string,
  actualHour: number | null,
  status: number,
  actualStartDate: string | null,
  actualEndDate: string | null,
  assignedEmployeePercent: number,
  reviewer: string,
  reviewEstimateHour: number,
  reviewEstimateStartDate: string,
  reviewEstimateEndDate: string,
  reviewActualHour: number | null,
  reviewActualStartDate: string | null,
  reviewActualEndDate: string | null,
  reviewerPercent: number
): Promise<number> {
  try {
    const response = await Knex('tasks').where({ id: id }).update({
      project: project,
      type: type,
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
      assignedEmployeePercent: assignedEmployeePercent,
      reviewer: reviewer,
      reviewEstimateHour: reviewEstimateHour,
      reviewEstimateStartDate: reviewEstimateStartDate,
      reviewEstimateEndDate: reviewEstimateEndDate,
      reviewActualHour: reviewActualHour,
      reviewActualStartDate: reviewActualStartDate,
      reviewActualEndDate: reviewActualEndDate,
      reviewerPercent: reviewerPercent,
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

export async function getAllTaskIdAndEmployee() {
  const employees = await Knex.join('employees', 'tasks.assignedEmployee', '=', 'employees.id')
    .select(
      'employees.id AS value',
      'employees.name AS label',
    )
    .from('tasks');
  return employees;
}

export async function getTaskByEmployeeId(
  EmployeeId: number,
  ReviewerId: number,
) {
  try {
    const response = await Knex('tasks')
      .where({
        assignedEmployee: EmployeeId,
      })
      .orWhere({ reviewer: ReviewerId })
      .join('projects', 'tasks.project', '=', 'projects.id')
      .distinct('projects.id')
      .select(
        'projects.id AS id',
        'projects.name AS name',
        'projects.description',
        'projects.language',
        'projects.type',
        'projects.start_date AS startDate',
        'projects.end_date AS endDate',
      )
      .from('tasks');

    console.log('response', response);
    return response;
  } catch (e) {
    return 0;
  }
}
