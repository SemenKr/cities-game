import {FC, useState} from "react";
import StartScreen from "src/components/StartScreen.tsx";
import {PlayerPage} from "src/components/PlayerPage.tsx";


export const Game: FC = () => {
    const [gameStarted, setGameStarted] = useState(false);//Хранит информацию о том, начата ли игра или нет.

    const onStartGame = () => {
        setGameStarted(true)
    }

    return (
        <>
            {gameStarted ? (

                <PlayerPage />
            ) : (
                <StartScreen onStartGame={onStartGame} />
            )}
        </>
    );
};
