import {FC} from 'react';
import {Button} from "antd";
interface StartScreenProps {
    onStartGame: () => void;
}

const StartScreen: FC<StartScreenProps> = ({onStartGame}) => {
    return (
        <>
            <div className="prose prose-sm start-screen">
                <h1 className={'text-center text-base text-black font-normal'}>Игра в города на время</h1>
                <p>
                    Цель: Назвать как можно больше реальных городов.
                </p>
                <ul>
                    <li>Запрещается повторение городов.</li>
                    <li>Названий городов на&nbsp;твердый &laquo;ъ&raquo; и&nbsp;мягкий &laquo;ъ&raquo; знак нет. Из-за
                        этого&nbsp;бы пропускаем эту букву и&nbsp;игрок должен назвать город на&nbsp;букву стоящую перед
                        ъ&nbsp;или ь&nbsp;знаком.
                    </li>
                    <li>Каждому игроку дается 2&nbsp;минуты на&nbsp;размышления, если спустя это время игрок
                        не&nbsp;вводит слово он&nbsp;считается проигравшим
                    </li>
                </ul>
                <Button
                    type={"primary"}
                    onClick={onStartGame}>
                    Начать игру
                </Button >
            </div>
        </>
    );
};


export default StartScreen;
