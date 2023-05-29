import React, { useCallback, useState } from 'react';
import Button from '@/components/Button';
import { FormProvider, useForm } from 'react-hook-form';
import { getSession } from 'next-auth/react';
import AuthBgLayout from '@/components/AuthBgLayout';
import { yupResolver } from '@hookform/resolvers/yup';
import ModalDialog from '@/components/ModalDialog';
import { changePasswordSchema } from '@/lib/validation/change_password';
import PasswordInput from '@/components/PasswordInput';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/Loading';

const ChangePassword = () => {
  const router = useRouter();

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(changePasswordSchema),
  });

  // Loading
  const [isRedirLogin, setIsRedirLogin] = useState(false);
  // Loading
  const [isLoading, setLoading] = useState(false);
  // Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogBody, setDialogBody] = useState('');

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    if (isRedirLogin) {
      router.push('/auth/signin');
    }
  }, [isRedirLogin, router]);

  const openModal = useCallback(
    (title: string, bodyText: string) => {
      setDialogTitle(title);
      setDialogBody(bodyText);
      setIsModalOpen(true);
    },
    [setIsModalOpen]
  );

  const { handleSubmit } = methods;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setLoading(true);
    const reqData = {
      email: router.query.email,
      token: router.query.token,
      password: data.confirmPassword,
    };

    try {
      await fetch('/api/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqData),
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          if (res.error) {
            // handle errors
            openModal(res.error, `Error : ${res.error}`);
          } else {
            // handle process
            setIsRedirLogin(true);
            const title = 'Password had Changed';
            const bodyText =
              'Your new password is successfully reset. Login to your Account';
            openModal(title, bodyText);
          }
        });
    } catch (error) {
      setLoading(false);
      const title = 'Something wrong';
      const bodyText = `There was error occur: ${error}`;
      openModal(title, bodyText);
    }
  };

  return (
    <>
      <AuthBgLayout>
        <div className="">
          <div className="mb-8">
            <h3 className="font-semibold text-2xl text-gray-800">
              Change Password
            </h3>
            <p className="text-gray-500 mt-1">
              Keep your data secure with a strong password.
            </p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <PasswordInput
                id="newPassword"
                label="New Password"
                placeholder="Enter your new password"
                requiredField
              />
              <PasswordInput
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your new password"
                requiredField
              />
              <Button type="submit" className="w-full mt-4">
                Change Password
              </Button>
            </form>
          </FormProvider>
        </div>
      </AuthBgLayout>
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
    </>
  );
};
export default ChangePassword;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: { destination: '/' },
    };
  }
  return {
    props: {},
  };
}
