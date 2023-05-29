import React, { ReactElement } from 'react';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';
import EmployeeAddEditForm from '@/components/EmployeeAddEditForm';

const EmployeeCreate: NextPageWithLayout = () => {
  return (
    <main>
      <EmployeeAddEditForm />
    </main>
  );
};

EmployeeCreate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EmployeeCreate;
