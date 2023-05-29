/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllTasksListForExcel } from '@/lib/dao/task-dao';

const getTaskListIdAndName = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const ownerId = parseInt(req.query.userId as string);
    const allTasks = await getAllTasksListForExcel(ownerId);
    res.status(200).json({ data: allTasks });
  } catch (error) {
    res.status(500).json(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getTaskListIdAndName(req, res);
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
