import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { classNames } from '@/lib/helper';

export default function ModalDialog({
  title,
  bodyText,
  btnLeftTitle,
  btnLeftOnClick,
  btnRightTitle,
  btnRightOnClick,
  onClose,
  preformatted,
}: {
  title: string;
  bodyText: string;
  btnLeftTitle?: string;
  btnLeftOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  btnRightTitle: string;
  btnRightOnClick: React.MouseEventHandler<HTMLButtonElement>;
  onClose: (value: boolean) => void;
  preformatted?: boolean;
}) {
  const completeButtonRef = useRef(null);
  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose} initialFocus={completeButtonRef}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-4">
                    {preformatted ? (
                      <pre className="text-sm text-gray-500">{bodyText}</pre>
                    ) : (
                      <p className="text-sm text-gray-500">{bodyText}</p>
                    )}
                  </div>

                  <div
                    className={classNames(
                      'flex mt-5',
                      btnLeftTitle ? 'justify-between' : 'justify-end'
                    )}
                  >
                    {btnLeftTitle && (
                      <button
                        type="button"
                        className="rounded-md px-4 py-2 text-sm border border-transparent font-medium text-primary hover:border-primary focus:outline-none"
                        onClick={btnLeftOnClick}
                      >
                        {btnLeftTitle}
                      </button>
                    )}
                    <button
                      ref={completeButtonRef}
                      type="button"
                      className="rounded-md px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-dark focus:outline-none"
                      onClick={btnRightOnClick}
                    >
                      {btnRightTitle}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
