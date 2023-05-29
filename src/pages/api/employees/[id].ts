/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  checkSimilarEmployeeExist,
  deleteEmployeeById,
  getEmployeeById,
  updateEmployeeById,
} from '@/lib/dao/employee-dao';
import { hashSync } from 'bcrypt';
import { validate } from '@/middleware/validate';
import { employeeUpdateServerSchema } from '@/lib/validation/employee-server';
import { deleteImageInCloudinary } from '@/lib/cloudinary';

const getEmployee = async (res: NextApiResponse, id: number) => {
  const employee = await getEmployeeById(id);
  if (employee) {
    res.status(200).json({ data: employee });
  } else {
    res.status(400).json({
      error: 'Request data is not exist',
      message: 'Request data is not exist',
    });
  }
};

const deleteOldEmployeeProfile = async (
  imageUrl: string,
  employeeId: number
) => {
  try {
    const oldEmployeeData = await getEmployeeById(employeeId);
    const oldImage = oldEmployeeData?.photo;

    if (oldImage && oldImage !== imageUrl) {
      await deleteImageInCloudinary(oldImage);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

async function updateEmployeeIntoDb(
  req: NextApiRequest,
  res: NextApiResponse,
  employeeId: number
) {
  try {
    const employee = req.body;
    const encryptPassword =
      employee?.password && hashSync(employee.password, 10);

    // Delete Old Image
    await deleteOldEmployeeProfile(employee.photo, employeeId);

    if (
      !(await checkSimilarEmployeeExist(
        employeeId,
        employee.name,
        employee.email,
        employee.address,
        employee.phone,
        employee.dob,
        employee.position
      ))
    ) {
      const response = await updateEmployeeById(
        employeeId,
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
        res.status(200).json({
          message: 'Employee updated successfully',
        });
      } else {
        res.status(500).json({
          message: 'Employee update into database error occur in server.',
        });
      }
    } else {
      res.status(400).json({
        error: 'Simliar employee is already existed',
        message: 'Simliar employee is already existed',
      });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}

const deleteEmployee = async (res: NextApiResponse, id: number) => {
  const response = await deleteEmployeeById(id);
  if (response) {
    res.status(200).json({ message: 'Employee deleted successfully' });
  } else {
    res.status(400).json({
      error: 'Request data is not exist',
      message: 'Request data is not exist',
    });
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = parseInt(req.query.id as string);
    if (req.method === 'GET') {
      await getEmployee(res, id);
    } else if (req.method === 'PUT') {
      await updateEmployeeIntoDb(req, res, id);
    } else if (req.method === 'DELETE') {
      await deleteEmployee(res, id);
    } else {
      res.status(405).json({ error: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export default validate(employeeUpdateServerSchema, handler);
