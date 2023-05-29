import React, { useCallback, useEffect, useState } from 'react';
import Card from '@/components/Card';
import { FormProvider, useForm } from 'react-hook-form';
import Input from '@/components/Input';
import DatePicker from '@/components/DatePicker';
import Button from '@/components/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { projectSchema } from '@/lib/validation/project';
import moment from 'moment';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/Loading';
import ModalDialog from '@/components/ModalDialog';
import { useSession } from 'next-auth/react';
import AccessDeniedPage from './AccessDeniedPage';
import { POSITION_ADMIN } from '@/lib/constants';

export default function ProjectAddEditForm({
  editForm,
}: {
  editForm?: boolean;
}) {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  // Router
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  // Dialog Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogBody, setDialogBody] = useState('');

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(projectSchema),
  });
  const { handleSubmit, setValue } = methods;

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const openModal = useCallback(
    (title: string, bodyText: string) => {
      setDialogTitle(title);
      setDialogBody(bodyText);
      setIsModalOpen(true);
    },
    [setIsModalOpen]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setLoading(true);
    // Change Date Format
    data.startDate = moment(data.startDate).format('yyyy-MM-DD');
    data.endDate = moment(data.endDate).format('yyyy-MM-DD');
    try {
      if (!editForm) {
        await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((json) => {
            if (!json.error) {
              setLoading(false);
              if (json.data) {
                router.push('/project/list');
              }
            } else {
              const title = json.error.toString();
              const bodyText = `Error: ${json.error.toString()}`;
              openModal(title, bodyText);
            }
          });
      } else {
        await fetch('/api/projects/' + router.query.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((json) => {
            setLoading(false);
            if (!json.error) {
              router.push('/project/list');
            } else {
              const title = json.error.toString();
              const bodyText = `Error: ${json.error.toString()}`;
              openModal(title, bodyText);
            }
          });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const title = 'Something wrong';
      const bodyText = `There was error occur: ${error}`;
      openModal(title, bodyText);
    }
  };

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const getProjectDataById = useCallback(
    async (id: number) => {
      await fetch('/api/projects/' + id)
        .then((res) => res.json())
        .then((json) => {
          const pp = json.data;
          pp.startDate = new Date(pp.startDate);
          pp.endDate = new Date(pp.endDate);
          for (const [key, value] of Object.entries(pp)) {
            setValue(key, value);
          }
        });
    },
    [setValue]
  );

  useEffect(() => {
    if (editForm && router.query.id !== undefined) {
      const id = parseInt(router.query.id as string);
      getProjectDataById(id);
    }
  }, [router, editForm, getProjectDataById]);

  if (!isAdmin) {
    return <AccessDeniedPage />;
  }

  return (
    <main>
      <div className="container sm:w-8/12 md:w-5/12 lg:w-4/12 mx-auto p-2">
        <Card title={editForm ? 'Project Update Form' : 'Project Create Form'}>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  id="name"
                  label="Name"
                  placeholder="Enter your project name"
                  requiredField
                />
                <Input
                  id="language"
                  label="Language"
                  placeholder="Enter your project language"
                  requiredField
                />
                <Input
                  id="description"
                  label="Description"
                  placeholder="Enter description"
                  requiredField
                />
                <DatePicker
                  id="startDate"
                  label="Start Date"
                  placeholder="YYYY-MM-DD"
                  requiredField
                />
                <DatePicker
                  id="endDate"
                  label="End Date"
                  placeholder="YYYY-MM-DD"
                  requiredField
                />
                <div className="flex justify-between mt-10">
                  <Button
                    type="button"
                    secondary
                    onClick={goBack}
                    className="w-40"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-40 ms-2">
                    {editForm ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </Card>
      </div>
      {isLoading && <LoadingSpinner />}
      {isModalOpen && (
        <ModalDialog
          title={dialogTitle}
          bodyText={dialogBody}
          btnRightTitle="Okay"
          btnRightOnClick={closeModal}
          // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
          onClose={() => {}}
        />
      )}
    </main>
  );
}
