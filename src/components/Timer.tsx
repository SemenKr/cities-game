import  {FC, useEffect, useState} from 'react';

interface TimerProps {
    minutes: number;
    seconds: number;
    onTimeout?: () => void;
    isPlayerTurn: boolean;
}

const Timer: FC<TimerProps> = ({ minutes, seconds, onTimeout, isPlayerTurn }) => {
    const [currentTime, setCurrentTime] = useState({
        minutes,
        seconds,
    });

    useEffect(() => {
        const timerInterval = setInterval(() => {
            if (currentTime.minutes === 0 && currentTime.seconds === 0) {
                clearInterval(timerInterval);
                onTimeout && onTimeout();
            } else {
                setCurrentTime((prevTime) => {
                    if (prevTime.seconds === 0) {
                        return {
                            minutes: prevTime.minutes - 1,
                            seconds: 59,
                        };
                    } else {
                        return {
                            minutes: prevTime.minutes,
                            seconds: prevTime.seconds - 1,
                        };
                    }
                });
            }
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [currentTime, onTimeout]);

    const formatTimeUnit = (unit: number) => (unit < 10 ? `0${unit}` : unit);

    return (
        <div>
            <span>{isPlayerTurn ? 'Your Turn: ' : 'Computer Turn: '}</span>
            <span>{`${formatTimeUnit(currentTime.minutes)}:${formatTimeUnit(currentTime.seconds)}`}</span>
        </div>
    );
};

export default Timer;
