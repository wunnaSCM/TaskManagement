/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllProjectIdAndName } from '@/lib/dao/project-dao';

const getProjectListIdAndName = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const projects = await getAllProjectIdAndName();
    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(500).json(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getProjectListIdAndName(req, res);
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
