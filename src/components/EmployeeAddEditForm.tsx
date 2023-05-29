// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-no-bind
import React, { useCallback, useState, useEffect } from 'react';
import Card from '@/components/Card';
import { FormProvider, useForm } from 'react-hook-form';
import Input from '@/components/Input';
import DatePicker from '@/components/DatePicker';
import Button from '@/components/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/Loading';
import ModalDialog from '@/components/ModalDialog';
import ImageInput from '@/components/ImageInput';
import {
  employeeCreateSchema,
  employeeUpdateSchema,
} from '@/lib/validation/employee';
import { useSession } from 'next-auth/react';
import { POSITION_ADMIN, POSITION_USER } from '@/lib/constants';
import AccessDeniedPage from './AccessDeniedPage';
import PasswordInput from './PasswordInput';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import ReactSelect from './ReactSelect';

interface EmployeeReqData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  dob: string;
  position: string;
  photo: string | File | null;
}

const POSITION_LIST = [
  { value: 0, label: 'Admin' },
  { value: 1, label: 'Member' },
];

export default function EmployeeAddEditForm({
  editForm,
}: {
  editForm?: boolean;
}) {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  const userId = session?.user?.id;
  // Router
  const router = useRouter();
  const employeeId = parseInt(router.query.id as string);

  const methods = useForm({
    mode: 'onTouched',
    resolver: editForm
      ? yupResolver(employeeUpdateSchema)
      : yupResolver(employeeCreateSchema),
  });

  const { handleSubmit, setValue, resetField } = methods;

  const [initloading, setInitLoading] = useState(true);
  const [isLoading, setLoading] = useState(false);
  // Dialog Modal
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogBody, setDialogBody] = useState('');

  const [isChecked, setIsChecked] = useState(false);

  const [reqData, setReqData] = useState<EmployeeReqData>();

  const closeConfirmDialog = useCallback(() => {
    setIsConfirmDialogOpen(false);
  }, [setIsConfirmDialogOpen]);

  const openConfirmDialog = useCallback(() => {
    setIsConfirmDialogOpen(true);
  }, [setIsConfirmDialogOpen]);

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

  const checkHandler = useCallback(() => {
    setIsChecked(!isChecked);
    resetField('password');
  }, [isChecked, resetField]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const getEmployeeById = useCallback(
    async (id: number) => {
      await fetch('/api/employees/' + id)
        .then((res) => res.json())
        .then((json) => {
          const e = json.data;
          e.dob = new Date(e.dob);
          e.position = POSITION_LIST[e.position];
          for (const [key, value] of Object.entries(e)) {
            setValue(key, value);
          }
        });
      setInitLoading(false);
    },
    [setInitLoading, setValue]
  );

  useEffect(() => {
    if (editForm && router.query.id !== undefined) {
      setInitLoading(true);
      const id = parseInt(router.query.id as string);
      getEmployeeById(id);
    } else {
      setInitLoading(false);
    }
  }, [router, editForm, getEmployeeById]);

  const getProfileImageData = async (
    image: string | File | null | undefined
  ): Promise<string | null> => {
    return image
      ? typeof image === 'string'
        ? image
        : image.name
          ? await uploadImageToCloudinary(image)
          : null
      : null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createEmployee = async (data: any) => {
    try {
      await fetch('/api/employees', {
        method: 'POST',
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((json) => {
          setLoading(false);
          if (!json.error) {
            isAdmin ? router.push('/employee/list') : router.back();
          } else {
            const title = json.error.toString();
            const bodyText = `Error: ${json.error.toString()}`;
            openModal(title, bodyText);
          }
        });
    } catch (error) {
      setLoading(false);
      const title = 'Something wrong';
      const bodyText = 'There was error occurs in Employee Create';
      openModal(title, bodyText);
    }
  };

  const updateEmployee = async () => {
    closeConfirmDialog();
    setLoading(true);
    const data = reqData as EmployeeReqData;
    data.photo = await getProfileImageData(data.photo);
    try {
      await fetch(`/api/employees/${router.query.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((json) => {
          setLoading(false);
          if (!json.error) {
            isAdmin ? router.push('/employee/list') : router.back();
          } else {
            const title = json.error.toString();
            const bodyText = `Error: ${json.error.toString()}`;
            openModal(title, bodyText);
          }
        });
    } catch (error) {
      setLoading(false);
      const title = 'Something wrong';
      const bodyText = 'There was error occurs in Employee Update';
      openModal(title, bodyText);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    data.dob = moment(data.dob).format('YYYY-MM-DD');
    data.position = data.position.value;

    if (editForm) {
      setReqData(data);
      openConfirmDialog();
    } else {
      setLoading(true);
      data.photo = await getProfileImageData(data.photo);
      await createEmployee(data);
    }
    setLoading(false);
  };

  if (initloading || !session || !router) {
    return <LoadingSpinner />;
  }

  if (!isAdmin && userId !== employeeId) {
    return <AccessDeniedPage />;
  }

  return (
    <main>
      {isLoading && <LoadingSpinner />}
      <div className="container sm:w-8/12 md:w-5/12 lg:w-4/12 mx-auto p-2">
        <Card
          title={editForm ? 'Employee Update Form' : 'Employee Create Form'}
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <Input
                  id="name"
                  label="Name"
                  placeholder="Enter employee name"
                  requiredField
                />
                <Input
                  id="email"
                  label="Email"
                  placeholder="Enter employee email"
                  readOnly={!isAdmin}
                  requiredField
                />
                {!editForm && (
                  <PasswordInput
                    id="password"
                    label="Password"
                    placeholder="Enter employee password"
                    requiredField
                  />
                )}
                <Input
                  id="address"
                  label="Address"
                  placeholder="Enter employee address"
                  requiredField
                />
                <ImageInput id="photo" label="Profile Photo" />
                <Input
                  id="phone"
                  label="Phone"
                  placeholder="Enter employee phone no."
                  requiredField
                />
                <DatePicker id="dob" label="Date of Birth" requiredField />
                {isAdmin && (
                  <ReactSelect
                    id="position"
                    label="Position"
                    optionsObject={POSITION_LIST}
                    defaultValue={editForm ? undefined : POSITION_USER}
                    placeholder="Select Position"
                    requiredField
                  />
                )}
                {editForm && (
                  <div className="space-y-5">
                    <div>
                      <input
                        type="checkbox"
                        name="agree"
                        id="agree"
                        checked={isChecked}
                        onChange={checkHandler}
                      />
                      <label
                        htmlFor="checkbox"
                        className="ml-4 text-sm font-medium text-primary"
                      >
                        Change Password
                      </label>
                      {isChecked ? (
                        <div className="mt-2">
                          <PasswordInput
                            id="password"
                            placeholder="Update employee password"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
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

                  {isConfirmDialogOpen && (
                    <ModalDialog
                      title="Update Employee"
                      bodyText={'Are you sure to update employee?'}
                      btnLeftTitle="Cancel"
                      btnLeftOnClick={closeConfirmDialog}
                      btnRightTitle="Confirm"
                      // eslint-disable-next-line react/jsx-no-bind
                      btnRightOnClick={updateEmployee}
                      // eslint-disable-next-line react/jsx-no-bind, @typescript-eslint/no-empty-function
                      onClose={() => {}}
                    />
                  )}
                  {isModalOpen && (
                    <ModalDialog
                      title={dialogTitle}
                      bodyText={dialogBody}
                      btnRightTitle="Okay"
                      btnRightOnClick={closeModal}
                      // eslint-disable-next-line react/jsx-no-bind, @typescript-eslint/no-empty-function
                      onClose={() => {}}
                    />
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </Card>
      </div>
    </main>
  );
}
