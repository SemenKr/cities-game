import {FC} from 'react';
import {Button, Divider, Flex, Segmented} from "antd";
import styles from './StartScreen.module.scss';
import { Typography } from 'antd';
import { ComputerDifficulty } from "src/types/gameSettings.ts";

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
}

const StartScreen: FC<StartScreenProps> = ({
    onStartGame,
    timerDurationSeconds,
    onTimerDurationChange,
    computerDifficulty,
    onComputerDifficultyChange,
}) => {
    return (
        <>
            <div className={styles.startscreen}>
                <h1 className={styles.startscreen__title}>Игра в города на время</h1>
                <Divider />
                <Paragraph strong >
                    Цель: Назвать как можно больше реальных городов.
                </Paragraph>
                <ul  className={styles.startscreen__list}>
                    <li>Запрещается повторение городов.</li>
                    <li>Названий городов на&nbsp;твердый &laquo;ъ&raquo; и&nbsp;мягкий &laquo;ъ&raquo; знак нет. Из-за
                        этого&nbsp;бы пропускаем эту букву и&nbsp;игрок должен назвать город на&nbsp;букву стоящую перед
                        ъ&nbsp;или ь&nbsp;знаком.
                    </li>
                    <li>Каждому игроку дается выбранное время на&nbsp;размышления, если спустя это время игрок
                        не&nbsp;вводит слово он&nbsp;считается проигравшим
                    </li>
                </ul>
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
                <Flex justify={"center"} style={{paddingTop:'2rem'}} >
                    <Button
                        size='large'
                        type={"primary"}
                        onClick={onStartGame}>
                        Начать игру
                    </Button >
                </Flex>

            </div>
        </>
    );
};


export default StartScreen;
