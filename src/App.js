import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState('light'); // 'light' ou 'dark'

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds}/${day}.${month}.${year}`;
  };

  const isLight = theme === 'light';
  const backgroundColor = isLight ? 'white' : 'black';
  const textColor = isLight ? 'black' : 'white';
  const buttonIcon = isLight ? '🌙' : '☀️';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor,
      color: textColor,
      fontFamily: 'Arial, sans-serif',
      fontSize: '2rem',
      position: 'relative'
    }}>
      <div>{formatTime(currentTime)}</div>
      <button 
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: textColor
        }}
      >
        {buttonIcon}
      </button>
    </div>
  );
};

export default App;