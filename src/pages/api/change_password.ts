/* eslint-disable no-magic-numbers */
import { RESET_PASSWORD_EXPIRED_TIME } from '@/lib/constants';
import { updatePasswordByEmail } from '@/lib/dao/employee-dao';
import {
  checkTokenValid,
  deleteTokenByEmail,
} from '@/lib/dao/password-reset-dao';
import type { NextApiRequest, NextApiResponse } from 'next';

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

    const { email, token, password } = body;

    // Check Request
    if (!email || !token || !password) {
      res.status(400).json({ error: 'Invalid Request' });
      return;
    }

    // Check Token exist
    const tokenResponse = await checkTokenValid(email, token);
    if (!tokenResponse) {
      res.status(400).json({ error: 'Invalid Token.' });
      return;
    }

    // Check Token expired
    const createdTime = new Date(tokenResponse.created_at).getTime();
    const currentDate = Date.now();
    if (currentDate - createdTime > RESET_PASSWORD_EXPIRED_TIME) {
      res.status(400).json({ error: 'Expired Token.' });
      return;
    }

    // Change Password
    const changePassRes = await updatePasswordByEmail(email, password);

    if (changePassRes) {
      // Delete Token
      await deleteTokenByEmail(email);

      // Response Success
      res.status(200).json({ message: 'Change password successfully' });
      return;
    }

    // Response Error
    res.status(400).json({ error: 'There is an error in change password.' });
  } catch (error) {
    res.status(404).json({ error: error });
    return;
  }
}
