/* eslint-disable no-magic-numbers */
import { getAllTaskIdAndEmployee } from '@/lib/dao/task-dao';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = parseInt(req.query.id as string);
  try {
    if (req.method === 'GET') {
      const employees = await getAllTaskIdAndEmployee(id);
      res.status(200).json({ data: employees });
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;