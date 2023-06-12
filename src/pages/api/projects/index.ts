/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import { validate } from '@/middleware/validate';
import {
  checkSimilarProjectExist,
  createProject,
  getAllProjectList,
} from '@/lib/dao/project-dao';
import { projectServerSchema } from '@/lib/validation/project-server';

const getListOfProjet = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const projects = await getAllProjectList();

    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(500).json(error);
  }
};

const storeProjectIntoDb = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const project = req.body;

  if (
    !(await checkSimilarProjectExist(
      0,
      project.name,
      project.language,
      project.description,
      project.startDate,
      project.endDate
    ))
  ) {
    const response = await createProject(
      project.name,
      project.language,
      project.description,
      project.type,
      project.startDate,
      project.endDate
    );

    if (response > 0) {
      res.status(200).json({
        data: { id: response },
        message: 'Project created successfully',
      });
    } else {
      res.status(500).json({
        message: 'Project create into database error occur in server.',
      });
    }
  } else {
    res.status(400).json({
      error: 'Simliar project is already existed',
      message: 'Simliar project is already existed',
    });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getListOfProjet(req, res);
    } else if (req.method === 'POST') {
      await storeProjectIntoDb(req, res);
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default validate(projectServerSchema, handler);
