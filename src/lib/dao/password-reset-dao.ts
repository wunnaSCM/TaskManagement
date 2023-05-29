/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import Knex from '../../../db/knex';
import { RESET_TOKEN_LENGTH } from '../constants';
import { getFormattedCurrentDateTime } from '../format';
import { getRandomString } from '../helper';

export async function storeResetPasswordToken(email: string) {
  try {
    const token = getRandomString(RESET_TOKEN_LENGTH);
    // Delete Existed Token
    await deleteTokenByEmail(email);
    // Store Token
    const response = await Knex('password_resets').insert({
      email: email,
      token: token,
      created_at: getFormattedCurrentDateTime(),
    });

    if (response) {
      return token;
    }
    console.log('Error:Store Reset Password Token');
    return 0;
  } catch (e) {
    console.log('Error:Store Reset Password Token:', e);
    return 0;
  }
}

export async function checkTokenValid(email: string, token: string) {
  try {
    const response = await Knex('password_resets').where({
      email: email,
      token: token,
    });
    if (response[0]) {
      return response[0];
    }
    console.log('Error:Check Validation Reset Password Token');
    return null;
  } catch (e) {
    console.log('Error:Check Validation Reset Password Token',e);
    return null;
  }
}

export async function deleteTokenByEmail(email: string): Promise<boolean> {
  const response = await Knex('password_resets').where({ email: email }).del();
  return response;
}
