/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  checkSimilarEmailExist,
  createEmployee,
  getAllEmployee,
  getTotalEmployeeCount,
} from '@/lib/dao/employee-dao';
import { paginateReqData } from '@/lib/pagination';
import { hashSync } from 'bcrypt';
import { validate } from '@/middleware/validate';
import { employeeCreateServerSchema } from '@/lib/validation/employee-server';

const getEmployeeList = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //Search
    const keyword = req.query.search as string;
    //Pagination
    const { page, offset, limit } = paginateReqData(req);
    const total = await getTotalEmployeeCount(keyword);
    const employees = await getAllEmployee(keyword, offset, limit);
    res
      .status(200)
      .json({ data: employees, page: page, limit: limit, total: total });
  } catch (error) {
    res.status(500).json(error);
  }
};

const storeEmployeeIntoDb = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const employee = req.body;
    const encryptPassword = hashSync(employee.password, 10);

    if (!(await checkSimilarEmailExist(employee.email))) {
      const response = await createEmployee(
        employee.name,
        employee.email,
        encryptPassword,
        employee.photo,
        employee.address,
        employee.phone,
        employee.dob,
        employee.position
      );
      if (response > 0) {
        return res
          .status(200)
          .json({ data: response, message: 'Employee created successfully' });
      } else {
        return res.status(500).json({ message: res });
      }
    } else {
      res.status(400).json({
        error: 'Email is already existed',
        message: 'Email is already existed',
      });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      await getEmployeeList(req, res);
    } else if (req.method === 'POST') {
      await storeEmployeeIntoDb(req, res);
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}

export default validate(employeeCreateServerSchema, handler);
