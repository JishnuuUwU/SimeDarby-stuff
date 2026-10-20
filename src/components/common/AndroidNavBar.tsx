import React from 'react';
import { useApp } from '../../context/AppContext';

export const AndroidNavBar: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="android-nav-bar" aria-hidden="true">
      {/* Back Triangle */}
      <button 
        className="nav-bar-btn"
        onClick={() => setActiveTab('home')}
        title="Back"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="19,2 5,12 19,22" />
        </svg>
      </button>

      {/* Home Circle */}
      <button 
        className="nav-bar-btn"
        onClick={() => setActiveTab('home')}
        title="Home"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      </button>

      {/* Recents Square */}
      <button 
        className="nav-bar-btn"
        title="Overview"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      </button>
    </div>
  );
};
