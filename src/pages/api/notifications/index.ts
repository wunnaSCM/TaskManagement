/* eslint-disable no-magic-numbers */
import { getNotification } from '@/lib/dao/notification-dao';
import { NextApiRequest, NextApiResponse } from 'next';

const getNotiList = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const ownerId = req?.query?.userId
      ? parseInt(req.query.userId as string)
      : 0;
    const notis = ownerId ? await getNotification(ownerId) : [];
    res
      .status(200)
      .json({ data: notis });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      await getNotiList(req, res);
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
