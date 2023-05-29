/* eslint-disable no-magic-numbers */
import type { NextApiRequest, NextApiResponse } from 'next';
import { validate } from '@/middleware/validate';
import { paginateReqData } from '@/lib/pagination';
import {
  createReport,
  getReportList,
  getReportCount,
} from '@/lib/dao/report-dao';
import { reportServerSchema } from '@/lib/validation/report-server';
import { createNotification } from '@/lib/dao/notification-dao';
import { getEmployeeById } from '@/lib/dao/employee-dao';

const getListOfReport = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //Search Keyword
    const keyword = {
      date: req.query?.date as string,
      reportBy: req.query?.reportBy as string,
      reportTo: req.query?.reportTo as string,
    };
    //Pagination
    const { page, offset, limit } = paginateReqData(req);
    const total = await getReportCount(keyword);
    const reports = await getReportList(keyword,offset, limit);

    res
      .status(200)
      .json({ data: reports, page: page, limit: limit, total: total });
  } catch (error) {
    res.status(500).json(error);
  }
};

const storeReportIntoDb = async (req: NextApiRequest, res: NextApiResponse) => {
  const report = req.body;

  const response = await createReport(
    report.description,
    report.reportTo,
    report.reportBy
  );

  const reportByEmployee = await getEmployeeById(report.reportBy);
  const responseForNoti = await createNotification(
    report.reportTo,
    'New Report',
    `You got a report from ${reportByEmployee.name}`,
  );

  if (response > 0 && responseForNoti > 0) {
    res.status(200).json({
      data: { id: response },
      message: 'Report created successfully',
    });
  } else {
    res.status(500).json({
      message: 'Report create into database error occur in server.',
    });
  }

};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      await getListOfReport(req, res);
    } else if (req.method === 'POST') {
      await storeReportIntoDb(req, res);
    } else {
      res.status(405).json({ message: 'Request method is invalid' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default validate(reportServerSchema, handler);
