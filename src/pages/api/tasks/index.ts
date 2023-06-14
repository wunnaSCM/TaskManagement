/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import { validate } from '@/middleware/validate';
import {
  checkSimilarTaskExist,
  createTask,
  getTaskList,
  getTaskCount,
} from '@/lib/dao/task-dao';
import { paginateReqData } from '@/lib/pagination';
import { taskCreateServerSchema } from '@/lib/validation/task-server';

const getListOfTask = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //Search
    const keyword = req.query.search as string;
    const status = parseInt(req.query.status as string);
    const ownerId = req?.query?.userId
      ? parseInt(req.query.userId as string)
      : 0;
    //Pagination
    const { page, offset, limit } = paginateReqData(req);

    const tasks = await getTaskList(keyword, offset, limit, status, ownerId);

    const total = await getTaskCount(keyword,status, ownerId);

    res
      .status(200)
      .json({ data: tasks, page: page, limit: limit, total: total });
  } catch (error) {
    res.status(500).json(error);
  }
};

const storeTaskIntoDb = async (req: NextApiRequest, res: NextApiResponse) => {
  const task = req.body;

  if (
    !(await checkSimilarTaskExist(
      task.project,
      task.title,
      task.description,
      task.assignedEmployee,
      task.estimateHour,
      task.estimateStartDate,
      task.estimateEndDate
    ))
  ) {
    const response = await createTask(
      task.project,
      task.type,
      task.title,
      task.description,
      task.assignedEmployee,
      task.estimateHour,
      task.estimateStartDate,
      task.estimateEndDate,
      task.reviewer,
      task.reviewEstimateHour,
      task.reviewEstimateStartDate,
      task.reviewEstimateEndDate,
    );

    if (response > 0) {
      res.status(200).json({
        data: { id: response },
        message: 'task created successfully',
      });
    } else {
      res.status(500).json({
        message: 'task create into database error occur in server.',
      });
    }
  } else {
    res.status(400).json({
      error: 'Simliar task is already existed',
      message: 'Simliar task is already existed',
    });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getListOfTask(req, res);
    } else if (req.method === 'POST') {
      await storeTaskIntoDb(req, res);
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default validate(taskCreateServerSchema, handler);
