import React, { ReactElement } from 'react';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../../_app';
import EmployeeAddEditForm from '@/components/EmployeeAddEditForm';

const EmployeeEdit: NextPageWithLayout = () => {
  return (
    <main>
      <EmployeeAddEditForm editForm />
    </main>
  );
};

EmployeeEdit.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EmployeeEdit;
