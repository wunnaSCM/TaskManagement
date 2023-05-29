/* eslint-disable no-magic-numbers */
import { NextApiRequest } from 'next';

export const paginateReqData = (req: NextApiRequest) => {
  const reqPage = parseInt(req.query.page as string);
  const page = reqPage ? reqPage : 1;
  const reqLimit = parseInt(req.query.limit as string);
  const limit = reqLimit ? (reqLimit > 20 ? 20 : reqLimit) : 5;
  const offset = (page - 1) * limit;

  return { page, offset, limit };
};
