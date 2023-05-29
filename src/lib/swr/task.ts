import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const status = [
  { name: 'Open' },
  { name: 'In Progress' },
  { name: 'Finish' },
  { name: 'Close' },
  { name: 'Not Close' },
  { name: 'All' },
];

export function useNotClosedTask(isAdmin: boolean, userId: number) {
  const { data, error, isLoading } = useSWR(
    '/api/tasks?status=5' + (!isAdmin && `&userId=${userId}`),
    fetcher
  );
  return {
    notClosedtask: data,
    isnotClosedtaskLoading: isLoading,
    isnotClosedtaskError: error,
  };
}

export function useAllTask(isAdmin: boolean, userId: number) {
  const { data, error, isLoading } = useSWR(
    '/api/tasks?' + (!isAdmin && `&userId=${userId}`),
    fetcher
  );
  return {
    allTask: data,
    isallTaskLoading: isLoading,
    isallTaskError: error,
  };
}

export function useProject() {
  const { data, error, isLoading } = useSWR('/api/projects/lists', fetcher);
  return {
    project: data,
    isProjectLoading: isLoading,
    isProjectError: error,
  };
}

export function useEmployee() {
  const { data, error, isLoading } = useSWR('/api/employees', fetcher);
  return {
    employee: data,
    isEmpLoading: isLoading,
    isEmpError: error,
  };
}

export function useReport() {
  const { data, error, isLoading } = useSWR('/api/reports', fetcher);
  return {
    report: data,
    isReportLoading: isLoading,
    isReportError: error,
  };
}
