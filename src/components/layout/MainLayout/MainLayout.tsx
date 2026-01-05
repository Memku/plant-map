import React from 'react';
import './MainLayout.css';

interface MainLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ header, children }) => {
  return (
    <div className="main-layout">
      {header}
      <main className="main-content">{children}</main>
    </div>
  );
};
