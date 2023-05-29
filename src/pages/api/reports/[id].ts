/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getReportById } from '@/lib/dao/report-dao';

const getReport = async (res: NextApiResponse, id: number) => {
  const report = await getReportById(id);
  if (report) {
    res.status(200).json({ data: report });
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
        await getReport(res, id);
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

export default handler;