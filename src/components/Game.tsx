import {FC, useState} from "react";
import StartScreen from "src/Screens/StartScrean/StartScreen.tsx";
import {PlayerPage} from "src/Screens/PlayerPage/PlayerPage.tsx";
import WinScreen from "src/components/WinScreen.tsx";
import LooseScreen from "src/components/LooseScreen.tsx";
import { GameOutcome } from "src/types/game.ts";
import { ComputerDifficulty } from "src/types/gameSettings.ts";
import {Layout} from "antd";
import {Content} from "antd/es/layout/layout";
import styles from './Game.module.css';


export const Game: FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOutcome, setGameOutcome] = useState<GameOutcome | null>(null);
    const [usedCitiesInGame, setUsedCitiesInGame] = useState<string[]>([]);
    const [timerDurationSeconds, setTimerDurationSeconds] = useState(120);
    const [computerDifficulty, setComputerDifficulty] = useState<ComputerDifficulty>('medium');
    const onStartGame = () => {
        setGameStarted(true);
        setGameOutcome(null);
        setUsedCitiesInGame([]);
    };
    const onRestartGame = () => {
        setGameStarted(false);
        setGameOutcome(null);
        setUsedCitiesInGame([]);
    };


    const handleGameOutcome = (outcome: GameOutcome) => {
        setGameOutcome(outcome);
    };


    return (
        <Layout className={styles.Container}>
            <Content>
                {gameStarted ? (
                    gameOutcome?.result === 'win' ? (
                        <WinScreen
                            onRestart={onRestartGame}
                            usedCitiesInGame={usedCitiesInGame}
                            reason={gameOutcome.reason}
                        />
                    ) : gameOutcome?.result === 'loose' ? (
                        <LooseScreen
                            onRestart={onRestartGame}
                            usedCitiesInGame={usedCitiesInGame}
                            reason={gameOutcome.reason}
                        />
                    ) : (
                        <PlayerPage
                            onGameOutcome={handleGameOutcome}
                            setUsedCitiesInGame={setUsedCitiesInGame}
                            timerDurationSeconds={timerDurationSeconds}
                            computerDifficulty={computerDifficulty}
                        />
                    )
                ) : (
                    <StartScreen
                        onStartGame={onStartGame}
                        timerDurationSeconds={timerDurationSeconds}
                        onTimerDurationChange={setTimerDurationSeconds}
                        computerDifficulty={computerDifficulty}
                        onComputerDifficultyChange={setComputerDifficulty}
                    />
                )}
            </Content>

        </Layout>
    );
};
