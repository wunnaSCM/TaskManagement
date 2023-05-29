/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-magic-numbers */
import React, { ReactElement } from 'react';
import Layout from '@/components/Layout';
import { NextPageWithLayout } from '../_app';
import { getAllEmployeeId, getEmployeeById } from '@/lib/dao/employee-dao';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { POSITION_ADMIN } from '@/lib/constants';
import moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProfilePage: NextPageWithLayout = ({ user }: any) => {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  const userId = session?.user?.id;
  // Router
  const router = useRouter();
  const employeeId = parseInt(router.query.id as string);

  return (
    <main>
      <>
        <div className="p-2 sm:p-8">
          <div className="flex flex-col md:flex-row space-y-4  md:space-y-0 md:space-x-4 lg:space-x-8">
            <div className="w-full md:w-6/12 bg-gray-50 border border-gray-200 rounded-lg shadow-xl overflow-hidden">
              <div className="w-full h-[400px] p-3">
                <div className="w-full h-full bg-gray-700 rounded border-2 border-dashed border-gray-400 p-2">
                  <img
                    src={user.photo ? user.photo : '/img/employee/user.png'}
                    className="w-full h-full object-contain"
                    alt="Employee Profile Image"
                  />
                </div>
              </div>
              {(isAdmin || userId === employeeId) && (
                <div className="flex place-content-center items-center space-x-4 p-4">
                  <Link href="/employee/list">
                    <div className="flex items-center bg-primary hover:bg-primary-dark text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                      <span>Back</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </Link>
                  <Link href={`/employee/edit/${user.id}`}>
                    <div className="flex items-center bg-primary hover:bg-primary-dark text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                      <span>Edit</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <div className="w-full md:w-6/12 bg-gray-50 border border-gray-200 rounded-lg shadow-xl p-4">
              <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
              <ul className="mt-8 text-gray-700">
                <li className="flex border-b py-2">
                  <span className="font-bold w-20 sm:w-32 md:w-32 lg:w-32 xl:w-32 2xl:w-32">
                    Name:
                  </span>
                  <span className="text-gray-700">{user.name}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-20 sm:w-32 md:w-32 lg:w-32 xl:w-32 2xl:w-32">
                    Email:
                  </span>
                  <span className="text-gray-700">{user.email}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-20 sm:w-32 md:w-32 lg:w-32 xl:w-32 2xl:w-32">
                    Phone
                  </span>
                  <span className="text-gray-700">{user.phone}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-20 sm:w-32 md:w-32 lg:w-32 xl:w-32 2xl:w-32">
                    Address:
                  </span>
                  <span className="text-gray-700">{user.address}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-20 sm:w-32 md:w-32 lg:w-32 xl:w-32 2xl:w-32">
                    Date of Birth:
                  </span>
                  <span className="text-gray-700">
                    {moment(user.dob).format('YYYY-MM-DD')}
                  </span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-20 sm:w-32 md:w-32 lg:w-32 xl:w-32 2xl:w-32">
                    Position:
                  </span>
                  <span className="text-gray-700">
                    {user.position === 0 ? 'Admin' : 'Member'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    </main>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProfilePage;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllEmployeeId();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const data = await getEmployeeById(params?.id as unknown as number);
  const user = JSON.parse(JSON.stringify(data));
  return {
    props: {
      user,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 30 seconds
    revalidate: 30, // In seconds
  };
};
