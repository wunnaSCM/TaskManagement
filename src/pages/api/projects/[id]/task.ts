import { getTaskByProjectId } from '@/lib/dao/task-dao';
import { paginateReqData } from '@/lib/pagination';
import type { NextApiRequest, NextApiResponse } from 'next';



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = parseInt(req.query.id as string);
  try {
    if (req.method === 'GET') {
      const tasks = await getTaskByProjectId(id);
      res.status(200).json({ data: tasks });
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
