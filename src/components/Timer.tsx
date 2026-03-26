import { CSSProperties, FC, useEffect, useRef } from 'react';
import beepSound from 'src/assets/audio/tic.mp3';

interface TimerProps {
    minutes: number;
    seconds: number;
}

const Timer: FC<TimerProps> = ({ minutes, seconds }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (minutes === 0 && seconds > 0 && seconds < 11) {
            void audio.play().catch(() => undefined);
            return;
        }

        if (!audio.paused) {
            audio.pause();
        }
        audio.currentTime = 0;
    }, [minutes, seconds]);

    const formatTimeUnit = (unit: number) => (unit < 10 ? `0${unit}` : unit);

    const timerStyle: CSSProperties = {
        color: minutes === 0 && seconds < 10 ? 'red' : 'black',
        fontSize: minutes === 0 && seconds < 10 ? '1.2em' : '1em',
        transition: 'color 0.3s ease-in-out,font-size 0.3s ease-in-out',
    };

    return (
        <div >
            <span>Осталось: </span>
            <span style={timerStyle}>{`${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`}</span>
            <audio ref={audioRef} src={beepSound} />
        </div>
    );
};

export default Timer;
