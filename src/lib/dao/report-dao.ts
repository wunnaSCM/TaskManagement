/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Report } from '../models/models';
import Knex from '../../../db/knex';
import { getFormattedCurrentDate } from '../format';

interface SearchKeyword {
  reportTo?: string;
  reportBy?: string;
  date?: string;
}

const formatReportObject = (report: any): Report => {
  return {
    id: report.id,
    description: report.description,
    date: report.date,
    reportTo: {
      id: report.reportToId,
      name: report.reportToName,
    },
    reportBy: {
      id: report.reportById,
      name: report.reportByName,
    },
  };
};

const getMainQuery = () => {
  return Knex.join('employees AS ert', 'reports.report_to', '=', 'ert.id')
    .join('employees AS erb', 'reports.report_by', '=', 'erb.id')
    .select(
      'reports.id',
      'reports.description',
      'reports.date',
      'ert.id AS reportToId',
      'ert.name  AS reportToName',
      'erb.id AS reportById',
      'erb.name  AS reportByName'
    )
    .from('reports');
};

const getSearchQuery = (query: any, keyword: SearchKeyword | undefined) => {
  return query
    .where((builder: any) => {
      if (keyword && keyword?.date) {
        return builder.where('reports.date', keyword.date);
      }
    })
    .where((builder: any) => {
      if (keyword && keyword?.reportTo) {
        return builder
          .where('reports.report_to', keyword.reportTo)
          .orWhere('ert.name', 'like', `%${keyword.reportTo}%`);
      }
    })
    .where((builder: any) => {
      if (keyword && keyword?.reportBy) {
        return builder
          .where('reports.report_by', keyword.reportBy)
          .orWhere('erb.name', 'like', `%${keyword.reportBy}%`);
      }
    });
};

export async function getReportList(
  keyword: SearchKeyword | undefined,
  offset: number,
  limit: number
): Promise<Report[]> {
  const mainQuery = getMainQuery();
  const query = getSearchQuery(mainQuery, keyword);
  const reports = await query
    .orderBy('reports.id', 'desc')
    .offset(offset)
    .limit(limit);

  const formattedReports = reports.map((r: any) =>
    formatReportObject(r)
  ) as Report[];
  return formattedReports;
}

export async function getReportCount(
  keyword?: SearchKeyword | undefined
): Promise<number> {
  const mainQuery = Knex.join(
    'employees AS ert',
    'reports.report_to',
    '=',
    'ert.id'
  )
    .join('employees AS erb', 'reports.report_by', '=', 'erb.id')
    .from('reports');
  const searchQuery = getSearchQuery(mainQuery, keyword);

  const response = await searchQuery.count('reports.id');

  const count = response[0]['count(`reports`.`id`)'];
  return count;
}

export async function getReportById(id: number): Promise<Report> {
  const mainQuery = getMainQuery();
  const reports = (await mainQuery.where('reports.id', id)) as object[];
  return formatReportObject(reports[0]);
}

export async function createReport(
  description: string,
  reportTo: number,
  reportBy: number
): Promise<number> {
  try {
    const response = await Knex('reports').insert({
      description: description,
      report_to: reportTo,
      report_by: reportBy,
      date: getFormattedCurrentDate(),
    });
    return response;
  } catch (e) {
    // eslint-disable-next-line no-magic-numbers
    return 0;
  }
}
