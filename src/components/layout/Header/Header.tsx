import React from 'react';
import { Button } from '../../common/Button/Button';
import './Header.css';

interface HeaderProps {
  onAddPlant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddPlant }) => {
  return (
    <header className="header">
      <h1 className="header-title">Plants Map</h1>
      <Button variant="primary" onClick={onAddPlant}>
        + Add Plant
      </Button>
    </header>
  );
};
