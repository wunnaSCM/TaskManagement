import React, { useCallback, useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { FormProvider, useForm } from 'react-hook-form';
import { getSession } from 'next-auth/react';
import AuthBgLayout from '@/components/AuthBgLayout';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgetPasswordSchema } from '@/lib/validation/forget-password';
import ModalDialog from '@/components/ModalDialog';
import LoadingSpinner from '@/components/Loading';
import Link from 'next/link';

const ForgotPassword = () => {
  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(forgetPasswordSchema),
  });

  const [isLoading, setLoading] = useState(false);
  // Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogBody, setDialogBody] = useState('');

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

  const { handleSubmit, setError } = methods;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await fetch('/api/forgot_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          if (res.error) {
            setError('email', {
              type: 'RegisterEmail',
              message: 'Specified email is not registered',
            });
          } else {
            const title = 'Email Send';
            const bodyText = 'Check your email. Reset password link is send.';
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
              Forgot Password
            </h3>
            <p className="text-gray-500 mt-1">
              Request Email for your password reset link.
            </p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="email"
                label="Email"
                placeholder="mail@mail.com"
                requiredField
              />
              <Button type="submit" className="w-full mt-4">
                Send
              </Button>
              <div className="flex items-center justify-center mt-6">
                <Link
                  href="/auth/signin"
                  className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
                >
                  Go Back to Login
                </Link>
              </div>
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
export default ForgotPassword;

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
