import {FC, useState} from "react";
import StartScreen from "src/components/StartScreen.tsx";
import {PlayerPage} from "src/components/PlayerPage.tsx";
import WinScreen from "src/components/WinScreen.tsx";
import LooseScreen from "src/components/LooseScreen.tsx";


export const Game: FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOutcome, setGameOutcome] = useState<'win' | 'loose' | null>(null);
    const onStartGame = () => {
        setGameStarted(true);
        setGameOutcome(null);
    };
    const onRestartGame = () => {
        setGameStarted(false);
        setGameOutcome(null)
    };


    const handleGameOutcome = (outcome: 'win' | 'loose') => {
        setGameOutcome(outcome);
    };


    return (
        <>
            {gameStarted ? (
                gameOutcome === 'win' ? (
                    <WinScreen onRestart={onRestartGame} />
                ) : gameOutcome === 'loose' ? (
                    <LooseScreen onRestart={onRestartGame} />
                ) : (
                    <PlayerPage onGameOutcome={handleGameOutcome} />
                )
            ) : (
                <StartScreen onStartGame={onStartGame} />
            )}
        </>
    );
};
