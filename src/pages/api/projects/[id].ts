/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  checkSimilarProjectExist,
  deleteProjectById,
  getProjectById,
  updateProjectById,
} from '@/lib/dao/project-dao';
import { projectServerSchema } from '@/lib/validation/project-server';
import { validate } from '@/middleware/validate';

const getProject = async (res: NextApiResponse, id: number) => {
  const project = await getProjectById(id);
  if (project) {
    res.status(200).json({ data: project });
  } else {
    res.status(400).json({
      error: 'Request data is not exist',
      message: 'Request data is not exist',
    });
  }
};

const updateProject = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: number
) => {
  // TODO:: Check "id" is exist
  const project = req.body;
  if (
    !(await checkSimilarProjectExist(
      id,
      project.name,
      project.language,
      project.description,
      project.startDate,
      project.endDate
    ))
  ) {
    const response = await updateProjectById(
      id,
      project.name,
      project.language,
      project.description,
      project.type,
      project.startDate,
      project.endDate
    );

    if (response > 0) {
      res.status(200).json({
        message: 'Project updated successfully',
      });
    } else {
      res.status(500).json({
        message: 'Project update into database error occur in server.',
      });
    }
  } else {
    res.status(400).json({
      error: 'Simliar project is already existed',
      message: 'Simliar project is already existed',
    });
  }
};

const deleteProject = async (res: NextApiResponse, id: number) => {
  const response = await deleteProjectById(id);
  if (response) {
    res.status(200).json({ message: 'Project deleted successfully' });
  } else {
    res.status(400).json({
      error: 'Request data is not exist',
      message: 'Request data is not exist',
    });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = parseInt(req.query.id as string);
    if (id > 0) {
      if (req.method === 'GET') {
        await getProject(res, id);
      } else if (req.method === 'PUT') {
        await updateProject(req, res, id);
      } else if (req.method === 'DELETE') {
        await deleteProject(res, id);
      } else {
        res.status(405).json({ message: 'Request method is invalid' });
      }
    } else {
      res
        .status(400)
        .json({ error: 'Request is invalid', message: 'Request is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default validate(projectServerSchema, handler);
