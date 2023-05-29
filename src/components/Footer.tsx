import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white/30 border-t border-gray-300">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-white sm:text-center">
          <a
            href="https://scm-mm.com/en/"
            className="text-gray-900 hover:underline font-semibold"
          >
            Seattle Consulting Myanmar
          </a>
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-white sm:mt-0">
          <li>
            <p className="text-gray-900 mr-4 hover:underline md:mr-6">
              Copyright © 2023{' '}
            </p>
          </li>
        </ul>
      </div>
    </footer>
  );
}
