/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import NavBar from '../components/Navbar';
import Footer from './Footer';

const Layout = ({ children }: any) => {
  return (
    <div className="content">
      <NavBar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
