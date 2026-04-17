import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button 
      className={`theme-toggle-btn ${theme}`}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {theme === 'light' ? '☀️' : '🌙'}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
