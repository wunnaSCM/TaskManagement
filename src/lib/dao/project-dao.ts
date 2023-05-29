/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { Project } from '../models/models';
import Knex from '../../../db/knex';
import {
  getFormattedCurrentDate,
  getFormattedCurrentDateTime,
} from '../format';

const getMainQuery = () => {
  return Knex.select(
    'id',
    'name',
    'language',
    'description',
    'start_date AS startDate',
    'end_date AS endDate',
    'created_at AS createdAt',
    'updated_at AS updatedAt'
  ).from('projects');
};

const getSearchQuery = (query: any, keyword: string) => {
  return query.where((builder: any) => {
    if (keyword) {
      return builder
        .where('name', 'like', `%${keyword}%`)
        .orWhere('language', `%${keyword}%`)
        .orWhere('description', `%${keyword}%`)
        .orWhere('start_date', keyword)
        .orWhere('end_date', keyword);
    }
  });
};

export async function getProjectList(
  keyword: string,
  offset: number,
  limit: number
): Promise<Project[]> {
  const mainQuery = getMainQuery();
  const searchQuery = getSearchQuery(mainQuery, keyword);
  const projects = (await searchQuery.offset(offset).limit(limit)) as Project[];
  return projects;
}

export async function getAllProjectList(): Promise<Project[]> {
  const mainQuery = getMainQuery();
  const projects = (await mainQuery) as Project[];
  return projects;
}

export async function getProjectCount(keyword: string): Promise<number> {
  const mainQuery = getMainQuery();
  const searchQuery = getSearchQuery(mainQuery, keyword);
  const response = await searchQuery.count('id');
  const count = response[0]['count(`id`)'];
  return count;
}

export async function getProjectById(id: number): Promise<Project> {
  const mainQuery = getMainQuery();
  const project = (await mainQuery.where({ id: id })) as Project[];
  return project[0];
}

export async function getAllProjectIdAndName() {
  const projects = await Knex.select(
    'id',
    'name',
    'start_date AS startDate',
    'end_date AS endDate'
  )
    .from('projects')
    .where('end_date', '>', getFormattedCurrentDate());
  return projects;
}

export async function checkSimilarProjectExist(
  ownId: number,
  name: string,
  language: string,
  description: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  try {
    const project = await Knex('projects')
      .where({
        name: name,
        language: language,
        description: description,
        start_date: startDate,
        end_date: endDate,
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
    console.log('Error:Check Similar Project Exist:', e);
    return false;
  }
}

export async function createProject(
  name: string,
  language: string,
  description: string,
  startDate: string,
  endDate: string
): Promise<number> {
  try {
    const currentDateTime = getFormattedCurrentDateTime();
    const response = await Knex('projects').insert({
      name: name,
      language: language,
      description: description,
      start_date: startDate,
      end_date: endDate,
      created_at: currentDateTime,
      updated_at: currentDateTime,
    });
    return response;
  } catch (e) {
    console.log('Error:Create Project:', e);
    return 0;
  }
}

export async function updateProjectById(
  id: number,
  name: string,
  language: string,
  description: string,
  startDate: string,
  endDate: string
): Promise<number> {
  try {
    const response = await Knex('projects').where({ id: id }).update({
      name: name,
      language: language,
      description: description,
      start_date: startDate,
      end_date: endDate,
      updated_at: getFormattedCurrentDateTime(),
    });
    return response;
  } catch (e) {
    console.log('Error:Update Project:', e);
    return 0;
  }
}

export async function deleteProjectById(id: number): Promise<boolean> {
  const response = await Knex('projects').where({ id: id }).del();
  return response;
}
