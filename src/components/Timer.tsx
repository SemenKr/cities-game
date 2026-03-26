import { FC, useEffect, useRef } from 'react';
import beepSound from 'src/assets/audio/tic.mp3';
import styles from './Timer.module.scss';

interface TimerProps {
    minutes: number;
    seconds: number;
}

const Timer: FC<TimerProps> = ({ minutes, seconds }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isCritical = minutes === 0 && seconds < 10;

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
    const timerClassName = isCritical
        ? `${styles.timer} ${styles.critical}`
        : styles.timer;

    return (
        <div className={timerClassName}>
            <span className={styles.label}>Осталось на ход</span>
            <span className={styles.value}>{`${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`}</span>
            <span className={styles.hint}>
                {isCritical ? 'Нужно ответить прямо сейчас' : 'Таймер обновляется каждую секунду'}
            </span>
            <audio ref={audioRef} src={beepSound} />
        </div>
    );
};

export default Timer;
