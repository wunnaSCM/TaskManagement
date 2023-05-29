import React from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { FormProvider, useForm } from 'react-hook-form';
import { getSession, signIn } from 'next-auth/react';
import PasswordInput from '@/components/PasswordInput';
import AuthBgLayout from '@/components/AuthBgLayout';
import { userLoginSchema } from '@/lib/validation/user-login';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Signin = () => {
  const router = useRouter();

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(userLoginSchema),
  });

  const { handleSubmit, setError } = methods;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).then((res: any) => {
      if (res.ok) {
        router.push('/');
      } else {
        setError('password', {
          type: 'Credentials',
          message: 'Email or password is incorrect',
        });
      }
    });
  };

  return (
    <>
      <AuthBgLayout>
        <div>
          <div className="mb-8">
            <h3 className="font-semibold text-3xl text-gray-800">Sign In </h3>
            <p className="text-gray-500 mt-3">
              Please sign in with your employee account.
            </p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="email"
                label="Email"
                placeholder="Enter your email"
                requiredField
              />
              <PasswordInput
                id="password"
                label="Password"
                placeholder="Enter your password"
                requiredField
              />
              <Button type="submit" className="w-full mt-4">
                Sign In
              </Button>
              <div className="flex items-center justify-center mt-6">
                <Link
                  href="/auth/forgot_password"
                  className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </AuthBgLayout>
    </>
  );
};
export default Signin;

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
