/* eslint-disable no-magic-numbers */
import { readNotifcation } from '@/lib/dao/notification-dao';
import { NextApiRequest, NextApiResponse } from 'next';

async function updateSeenNotification(req: NextApiRequest, res: NextApiResponse, id: number) {
  try {
    const response = await readNotifcation(id);

    if (response > 0) {
      res.status(200).json({
        message: 'Admin read notification successfully',
      });
    } else {
      res.status(500).json({
        error: 'Notification update into database error occur in server.',
      });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const id = parseInt(req.query.id as string);
  try {
    if (req.method === 'PUT') {
      updateSeenNotification(req, res, id);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;