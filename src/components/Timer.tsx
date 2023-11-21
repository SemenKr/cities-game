import React, { FC, useEffect, useState } from 'react';

interface TimerProps {
    onTimeout: () => void;
    isPlayerTurn: boolean;
}

const Timer: FC<TimerProps> = ({ onTimeout, isPlayerTurn }) => {
    const [seconds, setSeconds] = useState(120);

    useEffect(() => {
        let intervalId: number;

        if (isPlayerTurn) {
            intervalId = window.setInterval(() => {
                setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isPlayerTurn]);

    useEffect(() => {
        if (seconds === 0 && isPlayerTurn) {
            onTimeout();
        }
    }, [seconds, isPlayerTurn, onTimeout]);

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const timerStyle: React.CSSProperties = {
        color: seconds <= 10 && isPlayerTurn ? 'red' : 'inherit',
    };

    return (
        <div style={timerStyle}>
            <p>Осталось времени: {formatTime(seconds)}</p>
        </div>
    );
};

export default Timer;
