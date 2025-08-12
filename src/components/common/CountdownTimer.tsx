import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiresAt: string;
  onTimerEnd?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiresAt, onTimerEnd }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiresAt) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      if (onTimerEnd) {
        onTimerEnd();
      }
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
        {interval === 'minutes' ? ':' : ''}
      </span>
    );
  });

  return (
    <span className="font-mono">
      {timerComponents.length ? timerComponents : "00:00"}
    </span>
  );
};

export default CountdownTimer;