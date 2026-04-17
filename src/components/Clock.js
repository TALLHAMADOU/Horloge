import React from 'react';

const Clock = ({ hours, minutes, seconds }) => {
  return (
    <div className="clock-display">
      <div className="time-group">
        <span className="time-value">{hours}</span>
        <span className="time-label">HOURS</span>
      </div>
      <span className="time-separator">:</span>
      <div className="time-group">
        <span className="time-value">{minutes}</span>
        <span className="time-label">MINUTES</span>
      </div>
      <span className="time-separator animate-pulse">:</span>
      <div className="time-group">
        <span className="time-value accent">{seconds}</span>
        <span className="time-label">SECONDS</span>
      </div>
    </div>
  );
};

export default Clock;
