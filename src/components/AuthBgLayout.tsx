import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AuthBgLayout({ children }: { children: any }) {
  return (
    <div className="bg-cover bg-no-repeat bg-[url('/img/auth-wallpaper-portrait.jpg')] sm:bg-[url('/img/auth-wallpaper-landscape.jpg')]">
      <div className="flex w-full h-screen items-center justify-center bg-black/10">
        <div className="self-center hidden lg:flex flex-col p-5 sm:max-w-4xl xl:max-w-2xl">
          <div className=" text-gray-800">
            <h1 className="mb-3 font-bold text-5xl">Task Management</h1>
            <h3 className="mb-3 font-medium text-2xl text-gray-600">
              Seattle Consulting Myanmar
            </h3>
            <pre className="pr-3 text-gray-700">
              {
                'Streamline your productivity with our task management app.\nGet more done in less time with our intuitive task manager.\nOrganize your to-do list and conquer your day with ease.'
              }
            </pre>
          </div>
        </div>
        <div className="flex justify-center self-center">
          <div className="rounded-xl bg-gray-300/30 p-10 border border-gray-500/10 shadow-lg backdrop-blur-md max-sm:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}