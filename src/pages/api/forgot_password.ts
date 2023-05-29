/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getEmployeeByEmail } from '@/lib/dao/employee-dao';
import { render } from '@react-email/render';
import { sendEmail } from '../../lib/email';
import ResetPasswordEmail from '../../../emails/ResetEmailTemplate';
import { Employee } from '@/lib/models/models';
import { storeResetPasswordToken } from '@/lib/dao/password-reset-dao';

const sendResetLinkEmail = async (res: NextApiResponse, user: Employee) => {
  try {
    const token = await storeResetPasswordToken(user.email);
    const resetUrl = `${process.env.APP_URL}/auth/change_password?email=${user.email}&token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset Account Password',
      html: render(
        ResetPasswordEmail({
          userName: user.name,
          resetPasswordLink: resetUrl,
        })
      ),
    });

    res
      .status(200)
      .json({ message: 'Reset password link is sent to your email.' });
  } catch (error) {
    console.log('Error:Send Mail:', error);
    res.status(500).json({ error: error });
  }
};

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
      res.status(404).json({
        error: 'User does not exist!',
        message: 'User does not exist!',
      });
      return;
    } else {
      sendResetLinkEmail(res, user);
    }
  } catch (error) {
    res.status(404).json({ error: error });
    return;
  }
}
