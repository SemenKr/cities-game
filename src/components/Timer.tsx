import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import beepSound from 'src/assets/audio/tic.mp3'; // Update the path to your sound file

interface TimerProps {
    minutes: number;
    seconds: number;
    onTimeout?: () => void;
}

const Timer: FC<TimerProps> = ({ minutes, seconds, onTimeout }) => {
    const [currentTime, setCurrentTime] = useState({
        minutes,
        seconds,
    });
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            console.error('Audio element not found.');
            return;
        }

        const handleAudioEnded = () => {
            // Reset sound playing state when the sound completes
            audio.pause();
            audio.currentTime = 0;
        };

        audio.addEventListener('ended', handleAudioEnded);

        const timerInterval = setInterval(() => {
            if (currentTime.minutes === 0 && currentTime.seconds === 0) {
                clearInterval(timerInterval);
                onTimeout && onTimeout();
                audio.pause(); // Pause the audio when the timer ends
                audio.currentTime = 0;
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

            // Play the sound when there are less than 10 seconds remaining and the sound is not already playing
            if (currentTime.minutes === 0 && currentTime.seconds < 11 && audio.paused) {
                audio.play();
            }
        }, 1000);

        return () => {
            clearInterval(timerInterval);
            // audio.pause(); // Pause the audio when the timer is cleared
            audio.removeEventListener('ended', handleAudioEnded);
        };
    }, [currentTime, onTimeout]);

    const formatTimeUnit = (unit: number) => (unit < 10 ? `0${unit}` : unit);

    const timerStyle: CSSProperties = {
        color: currentTime.minutes === 0 && currentTime.seconds < 10 ? 'red' : 'black',
        fontSize: currentTime.minutes === 0 && currentTime.seconds < 10 ? '1.2em' : '1em',
        transition: 'color 0.3s ease-in-out,font-size 0.3s ease-in-out',
        // Добавьте другие стили, которые вы хотите применить при оставшихся 10 секундах
    };

    return (
        <div >
            <span>Осталось: </span>
            <span style={timerStyle}>{`${formatTimeUnit(currentTime.minutes)}:${formatTimeUnit(currentTime.seconds)}`}</span>
            <audio ref={audioRef} src={beepSound} />
        </div>
    );
};

export default Timer;
