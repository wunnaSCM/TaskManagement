/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import { Employee } from '../models/models';
import Knex from '../../../db/knex';
import bcrypt from 'bcrypt';
import { getFormattedCurrentDateTime } from '../format';

const filterSoftDeleted = (builder: any) => {
  return builder.whereNull('deletedAt');
};

const getMainQuery = () => {
  return Knex.select(
    'id',
    'name',
    'email',
    'photo',
    'address',
    'phone',
    'dob',
    'position',
    'createdAt',
    'updatedAt'
  )
    .from('employees')
    .where(filterSoftDeleted);
};

const getSearchQuery = (query: any, keyword: string) => {
  return query.where((builder: any) => {
    if (keyword) {
      return builder
        .where('name', 'like', `%${keyword}%`)
        .orWhere('email', 'like', `%${keyword}%`)
        .orWhere('address', 'like', `%${keyword}%`)
        .orWhere('phone', 'like', `%${keyword}%`)
        .orWhere('position', 'like', `%${keyword}%`)
        .orWhere('dob', 'like', `%${keyword}%`);
    }
  });
};

export async function getAllEmployee(
  keyword: string,
  offset: number,
  limit: number
): Promise<Employee[]> {
  const mainQuery = getMainQuery();
  const searchQuery = getSearchQuery(mainQuery, keyword);
  const employees = (await searchQuery
    .offset(offset)
    .limit(limit)) as Employee[];

  return employees;
}

export async function getTotalEmployeeCount(keyword: string): Promise<number> {
  const mainQuery = Knex('employees').where(filterSoftDeleted);
  const searchQuery = getSearchQuery(mainQuery, keyword);
  const response = await searchQuery.count('id');
  const count = response[0]['count(`id`)'];
  return count;
}

export async function getAllEmployeeList() {
  const employees = await Knex.select('id', 'name', 'email', 'position')
    .where(filterSoftDeleted)
    .from('employees');
  return employees;
}

export async function createEmployee(
  name: string,
  email: string,
  password: string,
  photo: string,
  address: string,
  phone: string,
  dob: string,
  position: number
): Promise<number> {
  try {
    const currentDateTime = getFormattedCurrentDateTime();

    const response =
      photo === null
        ? await Knex('employees').insert({
          name: name,
          email: email,
          password: password,
          address: address,
          phone: phone,
          dob: dob,
          position: position,
          createdAt: currentDateTime,
          updatedAt: currentDateTime,
        })
        : await Knex('employees').insert({
          name: name,
          email: email,
          password: password,
          photo: photo,
          address: address,
          phone: phone,
          dob: dob,
          position: position,
          createdAt: currentDateTime,
          updatedAt: currentDateTime,
        });

    return response;
  } catch (e) {
    console.log('Error:Create Employee:', e);
    return 0;
  }
}

export async function getAllEmployeeIdAndName() {
  const employees = await Knex.select('id', 'name')
    .from('employees')
    .where(filterSoftDeleted);
  return employees;
}

export async function checkSimilarEmailExist(email: string): Promise<boolean> {
  try {
    const users = await Knex('employees').where({
      email: email,
    });

    if (users[0]) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export async function getEmployeeById(id: number): Promise<Employee> {
  const mainQuery = getMainQuery();
  const employee = (await mainQuery.where({ id: id })) as Employee[];
  return employee[0];
}

export async function getEmployeeByEmail(email: string): Promise<Employee> {
  const mainQuery = getMainQuery();
  const employee = (await mainQuery.where({ email: email })) as Employee[];
  return employee[0];
}

export async function updateEmployeeById(
  id: number,
  name: string,
  email: string,
  password: string | undefined,
  photo: string,
  address: string,
  phone: string,
  dob: string,
  position: number
): Promise<number> {
  try {
    const formattedDate = getFormattedCurrentDateTime();

    const response = password
      ? await Knex('employees').where({ id: id }).update({
        name: name,
        email: email,
        password: password,
        photo: photo,
        address: address,
        phone: phone,
        dob: dob,
        position: position,
        updatedAt: formattedDate,
      })
      : await Knex('employees').where({ id: id }).update({
        name: name,
        email: email,
        photo: photo,
        address: address,
        phone: phone,
        dob: dob,
        position: position,
        updatedAt: formattedDate,
      });
    return response;
  } catch (e) {
    console.log('Error:Update Employee by Id:', e);
    return 0;
  }
}

export async function checkSimilarEmployeeExist(
  ownId: number,
  name: string,
  email: string,
  address: string,
  // photo: string,
  phone: string,
  dob: string,
  position: string
): Promise<boolean> {
  try {
    const project = await Knex('projects')
      .where({
        name: name,
        email: email,
        address: address,
        // photo: photo,
        phone: phone,
        dob: dob,
        position: position,
      })
      .where((builder: any) => {
        if (ownId > 0) {
          return builder.whrerNot('id', ownId);
        }
      });

    if (project[0]) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export async function getEmployeePasswordByEmail(email: string) {
  const employee = await Knex('employees')
    .where({ email: email })
    .select('password')
    .where(filterSoftDeleted);
  return employee[0].password;
}

export async function deleteEmployeeById(id: number): Promise<boolean> {
  const response = await Knex('employees')
    .where({ id: id })
    .update({ deletedAt: getFormattedCurrentDateTime() });
  return response;
}

export async function getAllEmployeeId() {
  const employees = await Knex.select('id')
    .from('employees')
    .where(filterSoftDeleted);

  return employees.map((e: any) => {
    return {
      params: {
        id: e.id.toString(),
      },
    };
  });
}

export async function updatePasswordByEmail(
  email: string,
  password: string
): Promise<number> {
  try {
    const newPassword = await bcrypt.hashSync(password, 10);

    const response = await Knex('employees').where({ email: email }).update({
      password: newPassword,
      updatedAt: getFormattedCurrentDateTime(),
    });
    return response;
  } catch (e) {
    console.log('Error:Update Employee by Email:', e);
    return 0;
  }
}
