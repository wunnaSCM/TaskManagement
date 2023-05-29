/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getEmployeeByEmail,
  getEmployeePasswordByEmail,
} from '@/lib/dao/employee-dao';
import bcrypt from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' });
      return;
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    //Check User
    const user = await getEmployeeByEmail(body.email);
    if (!user) {
      res.status(404).send({
        error: 'User does not exist!',
        message: 'User does not exist!',
      });
      return;
    }

    const userPassword = await getEmployeePasswordByEmail(user.email);

    // TODO:: Need to check Correct Password
    const passwordCorrect = await bcrypt.compare(body.password, userPassword);

    if (!passwordCorrect) {
      res
        .status(404)
        .send({ error: 'Wrong Password', message: 'Wrong Password' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error });
    return;
  }
}
