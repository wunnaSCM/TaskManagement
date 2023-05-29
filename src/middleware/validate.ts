/* eslint-disable no-magic-numbers */
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ObjectSchema } from 'yup';

export function validate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ObjectSchema<any>,
  handler: NextApiHandler
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (['POST', 'PUT'].includes(req.method as string)) {
      try {
        const reqBody =
          typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        req.body = await schema
          .camelCase()
          .validate(reqBody, { abortEarly: false, stripUnknown: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.errors) {
          return res.status(400).json({ error: error.errors });
        } else {
          return res
            .status(400)
            .json({ error: 'Something is wrong in request' });
        }
      }
    }
    await handler(req, res);
  };
}
