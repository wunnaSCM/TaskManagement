/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllTaskIdAndName } from '@/lib/dao/task-dao';

const getTaskListIdAndName = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const tasks = await getAllTaskIdAndName();
    res.status(200).json({ data: tasks });
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
