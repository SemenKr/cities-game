import {FC} from 'react';
import {Button, Flex, Segmented} from "antd";
import styles from './StartScreen.module.scss';
import { Typography } from 'antd';
import { ComputerDifficulty } from "src/types/gameSettings.ts";
import { PlayerStats } from "src/types/gameStats.ts";
import { getAverageCitiesPerRound, getStreakLabel } from "src/lib/gameStats.ts";

const { Paragraph } = Typography;

const TIMER_OPTIONS = [
    { label: '1 мин', value: 60 },
    { label: '2 мин', value: 120 },
    { label: '3 мин', value: 180 },
];

const DIFFICULTY_OPTIONS: { label: string; value: ComputerDifficulty }[] = [
    { label: 'Легко', value: 'easy' },
    { label: 'Нормально', value: 'medium' },
    { label: 'Сложно', value: 'hard' },
];

interface StartScreenProps {
    onStartGame: () => void;
    timerDurationSeconds: number;
    onTimerDurationChange: (duration: number) => void;
    computerDifficulty: ComputerDifficulty;
    onComputerDifficultyChange: (difficulty: ComputerDifficulty) => void;
    playerStats: PlayerStats;
}

const StartScreen: FC<StartScreenProps> = ({
    onStartGame,
    timerDurationSeconds,
    onTimerDurationChange,
    computerDifficulty,
    onComputerDifficultyChange,
    playerStats,
}) => {
    const averageCities = getAverageCitiesPerRound(playerStats);
    const streakLabel = getStreakLabel(playerStats);

    return (
        <>
            <div className={styles.startscreen}>
                <div className={styles.startscreen__hero}>
                    <div className={styles.startscreen__eyebrow}>Portfolio mode</div>
                    <h1 className={styles.startscreen__title}>Игра в города на время</h1>
                    <Paragraph className={styles.startscreen__intro}>
                        Раундовая словесная дуэль с адаптивным таймером, подсказками и тремя уровнями сложности компьютера.
                    </Paragraph>
                </div>
                <div className={styles.startscreen__body}>
                    <section className={styles.startscreen__rules}>
                        <Paragraph strong className={styles.startscreen__goal}>
                            Цель: назвать как можно больше реальных городов.
                        </Paragraph>
                        <ul className={styles.startscreen__list}>
                            <li>Повторять города нельзя.</li>
                            <li>Буквы `ъ` и `ь` в конце названия пропускаются.</li>
                            <li>Если время хода заканчивается, игрок проигрывает раунд.</li>
                        </ul>
                    </section>

                    <div className={styles.startscreen__panel}>
                        <div className={styles.startscreen__settings}>
                            <div className={styles.startscreen__setting}>
                                <Paragraph strong>Длительность хода</Paragraph>
                                <Segmented
                                    block
                                    options={TIMER_OPTIONS}
                                    value={timerDurationSeconds}
                                    onChange={(value) => onTimerDurationChange(Number(value))}
                                />
                            </div>
                            <div className={styles.startscreen__setting}>
                                <Paragraph strong>Сложность компьютера</Paragraph>
                                <Segmented
                                    block
                                    options={DIFFICULTY_OPTIONS}
                                    value={computerDifficulty}
                                    onChange={(value) => onComputerDifficultyChange(value as ComputerDifficulty)}
                                />
                            </div>
                        </div>
                        <div className={styles.startscreen__stats}>
                            <div className={styles.startscreen__statCard}>
                                <Paragraph strong>Сыграно</Paragraph>
                                <div className={styles.startscreen__statValue}>{playerStats.totalGames}</div>
                            </div>
                            <div className={styles.startscreen__statCard}>
                                <Paragraph strong>Рекорд</Paragraph>
                                <div className={styles.startscreen__statValue}>{playerStats.bestRoundCities}</div>
                            </div>
                            <div className={styles.startscreen__statCard}>
                                <Paragraph strong>Среднее</Paragraph>
                                <div className={styles.startscreen__statValue}>{averageCities}</div>
                            </div>
                            <div className={styles.startscreen__statCard}>
                                <Paragraph strong>Серия</Paragraph>
                                <div className={styles.startscreen__statSubvalue}>{streakLabel}</div>
                            </div>
                        </div>
                        <Flex justify={"center"} className={styles.startscreen__actions}>
                            <Button
                                size='large'
                                className={styles.startscreen__button}
                                type={"primary"}
                                onClick={onStartGame}>
                                Начать игру
                            </Button>
                        </Flex>
                    </div>
                </div>

            </div>
        </>
    );
};


export default StartScreen;
