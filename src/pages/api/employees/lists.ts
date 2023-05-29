/* eslint-disable no-magic-numbers */
import { getAllEmployeeList } from '@/lib/dao/employee-dao';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const employees = await getAllEmployeeList();
      res.status(200).json({ data: employees });
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
