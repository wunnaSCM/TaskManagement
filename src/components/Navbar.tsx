/* eslint-disable no-magic-numbers */
/* eslint-disable react/jsx-no-bind */
import React, { Fragment } from 'react';
import { Disclosure, Transition, Popover } from '@headlessui/react';
import Link from 'next/link';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import { useSession, signOut } from 'next-auth/react';
import { classNames } from '@/lib/helper';
import { useRouter } from 'next/router';
import { POSITION_ADMIN } from '@/lib/constants';
import useSWR from 'swr';
import { Notification } from '@/lib/models/models';
import moment from 'moment';

const adminNav = [
  { name: 'Task', href: '/task/list' },
  { name: 'Employee', href: '/employee/list' },
  { name: 'Project', href: '/project/list' },
  { name: 'Report', href: '/report/list' },
];

const userNav = [
  { name: 'Task', href: '/task/list' },
  { name: 'Report', href: '/report/list' },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useNoti = (userId: number) => {
  const { data, isLoading, error, mutate } = useSWR(
    `/api/notifications?userId=${userId}`,
    fetcher
  );
  const unread = data?.data?.filter((n: Notification) => !n.checked);

  return {
    notiData: data?.data,
    unreadTotal: unread?.length,
    isNotiLoading: isLoading,
    isNotiError: error,
    notiMutate: mutate,
  };
};

export default function Example() {
  // Session
  const { data: session } = useSession();
  const isAdmin = session?.user?.position === POSITION_ADMIN ? true : false;
  const username = session?.user?.name as string;
  const userId = session?.user?.id as number;
  // Navigation Tab
  const navigation = isAdmin ? adminNav : userNav;
  // Router
  const router = useRouter();
  const currentPath = router.pathname;

  //  noti fetch
  const { notiData, unreadTotal, notiMutate } = useNoti(userId);

  const onNotiMarkAsRead = (noti: Notification) => {
    fetch(`/api/notifications/${noti.id}`, {
      method: 'PUT',
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          //delete locally
          const newData = notiData?.map((n: Notification) => {
            if (n.id === noti.id) {
              return { ...n, checked: 1 };
            } else {
              return n;
            }
          });
          notiMutate(newData);
          const reportBy = noti.body.slice(22);
          router.push(
            `/report/list?reportTo=${username}&reportBy=${reportBy}&date=`
          );
        } else {
          // fail
        }
      });
  };

  return (
    <Disclosure
      as="nav"
      className="backdrop-blur bg-white/30 sticky top-0 border-b border-gray-300 z-50"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-10xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Link href="/">
                  <div className="flex flex-shrink-0 items-center">
                    <Image
                      src="/img/tm-logo.png"
                      className="block h-8 w-auto"
                      alt="Picture of the author"
                      width={36}
                      height={36}
                    />
                    <div className="ms-3 w-auto lg:block">
                      <h5 className="font-bold text-gray-900 text-md">SCM</h5>
                      <h6 className="font-light text-primary text-[10px] md:text-xs">
                        Task Management System
                      </h6>
                    </div>
                  </div>
                </Link>
                <div className="hidden sm:ml-6 sm:block md:mt-3 lg:mt-0 sm:mt-2 2xl:mt-0">
                  <div className="flex space-x-4">
                    {navigation.map((item) => {
                      const isActive = currentPath === item.href ? true : false;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            isActive
                              ? 'text-primary'
                              : 'text-gray-900 hover:text-primary',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 group cursor-pointer">
                {isAdmin && (
                  <Popover className="relative">
                    {() => (
                      <>
                        <Popover.Button className="focus:outline-none">
                          <div className="relative me-5 mt-2">
                            <BellIcon className="w-7 h-7" />
                            <span className="sr-only">Notifications</span>
                            {notiData?.length && unreadTotal ? (
                              <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -right-1">
                                {unreadTotal > 9 ? (
                                  <>
                                    9<sup>+</sup>
                                  </>
                                ) : (
                                  unreadTotal
                                )}
                              </div>
                            ) : null}
                          </div>
                        </Popover.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute right-0 top-full z-10 mt-3 w-80 max-w-md rounded-xl bg-white shadow-lg shadow-gray-300 border border-gray-300 overflow-hidden">
                            {notiData?.length ? (
                              <div className="overflow-y-auto overflow-x-hidden max-h-80 p-2 space-y-2">
                                {notiData?.map((n: Notification) => (
                                  <Popover.Button
                                    key={n.id}
                                    onClick={() => {
                                      onNotiMarkAsRead(n);
                                    }}
                                    className={classNames(
                                      n.checked
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'bg-gray-50 text-gray-800 font-semibold',
                                      'w-full relative p-2 text-left rounded'
                                    )}
                                  >
                                    <p className="text-sm">{n.title}</p>
                                    <p className="text-xs mt-1">{n.body}</p>
                                    <p className="text-xs text-gray-400 font-normal mt-1">
                                      {moment(n.createdAt).fromNow()}
                                    </p>
                                    {!n.checked ? (
                                      <span className="absolute top-2 right-0 bg-primary-light text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                        New
                                      </span>
                                    ) : null}
                                  </Popover.Button>
                                ))}
                              </div>
                            ) : (
                              <div className="px-2 py-8 text-center">
                                <p>There is no notification</p>
                              </div>
                            )}
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                )}
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={`
                      ${open ? '' : 'text-opacity-90'}
                      flex focus:outline-none items-center gap-x-1 font-semibold leading-6 text-gray-900 text-sm`}
                      >
                        <div className="md:hidden lg:hidden 2xl:hidden sm:block">
                          {username?.length >= 2
                            ? username.slice(0, 2) + '..'
                            : username}
                        </div>

                        <div className="md:block lg:block 2xl:block hidden">
                          {username}
                        </div>

                        <ChevronDownIcon
                          className="h-5 w-5 flex-none text-gray-400"
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <div className="md:hidden lg:hidden 2xl:hidden block opacity-0 bg-black text-white text-center text-xs rounded-lg py-0 absolute group-hover:opacity-100 -bottom-1/2 mx-auto px-3 pointer-events-none mt-2 mb-2">
                        {username}
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute right-0 top-full z-10 mt-3 w-60 max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            <Link
                              href={`/employee/${userId}`}
                              className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 cursor-pointer"
                            >
                              <UserIcon className="w-6 h-6" />
                              <span>Profile</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => signOut()}
                              className="w-full flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 cursor-pointer"
                            >
                              <ArrowRightOnRectangleIcon className="w-6 h-6" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = currentPath === item.href ? true : false;
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={classNames(
                      isActive
                        ? 'text-primary'
                        : 'text-gray-900 hover:text-primary',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
