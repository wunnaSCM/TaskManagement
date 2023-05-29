/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import { hashSync } from 'bcrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const reqBody =
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const hashText = hashSync(reqBody.message, 10);
      res.status(200).json({ hash: hashText });
    } else {
      res.status(405).json({ message: 'Method is not allowed' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
