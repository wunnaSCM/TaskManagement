/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from '@/lib/dao/task-dao';

import { validate } from '@/middleware/validate';
import { taskUpdateServerSchema } from '@/lib/validation/task-server';

const getTask = async (res: NextApiResponse, id: number) => {
  try {
    const task = await getTaskById(id);
    if (task) {
      res.status(200).json({ data: task });
    } else {
      res.status(400).json({
        error: 'Request data is not exist',
        message: 'Request data is not exist',
      });
    }
  } catch (error) {
    res.status(400).json({
      error: 'Request data is not exist',
      message: 'Request data is not exist',
    });
  }
};

const updateTask = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: number
) => {
  // TODO:: Check "id" is exist
  try {
    const task = req.body;
    const response = await updateTaskById(
      id,
      task.project,
      task.type,
      task.title,
      task.description,
      task.assignedEmployee,
      task.estimateHour,
      task.estimateStartDate,
      task.estimateEndDate,
      task.actualHour,
      task.status,
      task.actualStartDate,
      task.actualEndDate,
      task.assignedEmployeePercent,
      task.reviewer,
      task.reviewEstimateHour,
      task.reviewEstimateStartDate,
      task.reviewEstimateEndDate,
      task.reviewActualHour,
      task.reviewActualStartDate,
      task.reviewActualEndDate,
      task.reviewerPercent
    );

    if (response > 0) {
      res.status(200).json({
        message: 'Task updated successfully',
      });
    } else {
      res.status(500).json({
        error: 'Task update into database error occur in server.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

const deleteTask = async (res: NextApiResponse, id: number) => {
  const response = await deleteTaskById(id);
  if (response) {
    res.status(200).json({ message: 'Task deleted successfully' });
  } else {
    res.status(400).json({
      error: 'Request data is not exist',
      message: 'Request data is not exist',
    });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = parseInt(req.query.id as string);
    if (id > 0) {
      if (req.method === 'GET') {
        await getTask(res, id);
      } else if (req.method === 'PUT') {
        await updateTask(req, res, id);
      } else if (req.method === 'DELETE') {
        await deleteTask(res, id);
      } else {
        res.status(405).json({ message: 'Request method is invalid' });
      }
    } else {
      res
        .status(400)
        .json({ error: 'Request is invalid', message: 'Request is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default validate(taskUpdateServerSchema, handler);
