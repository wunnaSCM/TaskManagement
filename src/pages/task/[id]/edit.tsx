import React, { ReactElement } from 'react';
import TaskAddEditForm from '@/components/TaskAddEditForm';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../../_app';

const TaskUpdate: NextPageWithLayout = () => {
  return (
    <main>
      <TaskAddEditForm editForm />
    </main>
  );
};

TaskUpdate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TaskUpdate;
