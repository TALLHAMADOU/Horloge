import React from 'react';

const DateDisplay = ({ day, month, year }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const now = new Date();
  const dayName = days[now.getDay()];
  const monthName = months[parseInt(month) - 1];

  return (
    <div className="date-display">
      <span className="day-name">{dayName}</span>
      <span className="full-date">{day} {monthName} {year}</span>
    </div>
  );
};

export default DateDisplay;
