import { FC, useEffect, useState, useRef } from 'react';

interface TimerProps {
    onTimeout: () => void;
    isPlayerTurn: boolean;
    minutes: number;
    seconds: number;
}

const Timer: FC<TimerProps> = ({ onTimeout, isPlayerTurn, minutes, seconds }) => {
    const [isFlashing, setIsFlashing] = useState(false);
    const tickingSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (minutes === 0 && seconds <= 10) {
            setIsFlashing(true);
        } else {
            setIsFlashing(false);
        }
    }, [minutes, seconds]);

    const playTickingSound = () => {
        if (tickingSoundRef.current) {
            tickingSoundRef.current.play();
        }
    };

    const stopTickingSound = () => {
        if (tickingSoundRef.current) {
            tickingSoundRef.current.pause();
            tickingSoundRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        // Play ticking sound when flashing and player's turn
        if (isFlashing && isPlayerTurn) {
            playTickingSound();
        } else {
            stopTickingSound();
        }
    }, [isFlashing, isPlayerTurn]);

    return (
        <div style={{ color: isFlashing && isPlayerTurn ? 'red' : 'inherit' }}>
            <p>
                Осталось времени: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <audio ref={tickingSoundRef} src="src/assets/audio/tic.mp3" />
        </div>
    );
};

export default Timer;
