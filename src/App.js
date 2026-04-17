import React, { useState, useEffect } from 'react';
import './App.css';
import Clock from './components/Clock';
import ThemeToggle from './components/ThemeToggle';
import DateDisplay from './components/DateDisplay';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const formatTimeInfo = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return { hours, minutes, seconds, day, month, year };
  };

  const time = formatTimeInfo(currentTime);

  return (
    <div className={`App ${theme}`}>
      {/* Background Glows for "Pro-Max" feel */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>

      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <main className="main-container">
        <Clock 
          hours={time.hours} 
          minutes={time.minutes} 
          seconds={time.seconds} 
        />
        <DateDisplay 
          day={time.day} 
          month={time.month} 
          year={time.year} 
        />
      </main>
    </div>
  );
};

export default App;