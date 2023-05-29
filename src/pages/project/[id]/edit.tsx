import React, { ReactElement } from 'react';
import ProjectAddEditForm from '@/components/ProjectAddEditForm';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../../_app';

const ProjectUpdate: NextPageWithLayout = () => {
  return (
    <main>
      <ProjectAddEditForm editForm />
    </main>
  );
};

ProjectUpdate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProjectUpdate;
