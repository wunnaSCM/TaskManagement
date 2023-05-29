/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import Knex from '../../../db/knex';
import { getFormattedCurrentDateTime, getSubtractedDate } from '../format';
import { Notification } from '../models/models';

export async function createNotification(
  ownerId: number,
  title: string,
  body: string,
): Promise<number> {
  try {
    const response = await Knex('notifications').insert({
      ownerId: ownerId,
      title: title,
      body: body,
      checked: 0,
      created_at: getFormattedCurrentDateTime(),
    });
    return response;
  } catch (e) {
    console.log('Error:Create Notification:', e);
    return 0;
  }
}

export async function getNotification(ownerId: number): Promise<Notification[]> {

  const noti = await Knex.select(
    'id',
    'ownerId',
    'title',
    'body',
    'checked',
    'created_at AS createdAt'
  )
    .where({ ownerId: ownerId })
    .where('created_at', '>' , getSubtractedDate(7))
    .orderBy('id', 'desc')
    .from('notifications') as Notification[];
  return noti;
}

export async function readNotifcation(
  id: number,
): Promise<number> {
  try {
    const response = await Knex('notifications').where({ id: id }).update({ checked: 1 });
    return response;
  } catch (e) {
    console.log('Error:Read Notification:', e);
    return 0;
  }
}