import React, { ReactElement } from 'react';
import ProjectAddEditForm from '@/components/ProjectAddEditForm';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';

const ProjectCreate: NextPageWithLayout = () => {
  return (
    <main>
      <ProjectAddEditForm />
    </main>
  );
};

ProjectCreate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProjectCreate;
