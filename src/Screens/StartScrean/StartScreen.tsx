import {FC} from 'react';
import {Button, Divider, Flex} from "antd";
import styles from './StartScreen.module.scss';
import { Typography } from 'antd';

const { Paragraph } = Typography;

interface StartScreenProps {
    onStartGame: () => void;
}

const StartScreen: FC<StartScreenProps> = ({onStartGame}) => {
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
                    <li>Каждому игроку дается 2&nbsp;минуты на&nbsp;размышления, если спустя это время игрок
                        не&nbsp;вводит слово он&nbsp;считается проигравшим
                    </li>
                </ul>
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
