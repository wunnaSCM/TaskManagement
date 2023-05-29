import React, { ReactElement } from 'react';
import TaskAddEditForm from '@/components/TaskAddEditForm';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';
import { useSession } from 'next-auth/react';
import { POSITION_ADMIN } from '@/lib/constants';
import AccessDeniedPage from '@/components/AccessDeniedPage';

const TaskCreate: NextPageWithLayout = () => {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;

  if (!isAdmin) {
    return <AccessDeniedPage />;
  }
  return (
    <main>
      <TaskAddEditForm />
    </main>
  );
};

TaskCreate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default TaskCreate;
