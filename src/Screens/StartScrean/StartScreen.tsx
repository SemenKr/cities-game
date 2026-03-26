import {FC} from 'react';
import {Button, Divider, Flex, Segmented} from "antd";
import styles from './StartScreen.module.scss';
import { Typography } from 'antd';

const { Paragraph } = Typography;

const TIMER_OPTIONS = [
    { label: '1 мин', value: 60 },
    { label: '2 мин', value: 120 },
    { label: '3 мин', value: 180 },
];

interface StartScreenProps {
    onStartGame: () => void;
    timerDurationSeconds: number;
    onTimerDurationChange: (duration: number) => void;
}

const StartScreen: FC<StartScreenProps> = ({
    onStartGame,
    timerDurationSeconds,
    onTimerDurationChange,
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
                <div className={styles.startscreen__timer}>
                    <Paragraph strong>Длительность хода</Paragraph>
                    <Segmented
                        block
                        options={TIMER_OPTIONS}
                        value={timerDurationSeconds}
                        onChange={(value) => onTimerDurationChange(Number(value))}
                    />
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
