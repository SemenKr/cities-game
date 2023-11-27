import {FC, useState} from "react";
import StartScreen from "src/Screens/StartScrean/StartScreen.tsx";
import {PlayerPage} from "src/Screens/PlayerPage/PlayerPage.tsx";
import WinScreen from "src/components/WinScreen.tsx";
import LooseScreen from "src/components/LooseScreen.tsx";
import {Layout} from "antd";
import {Content} from "antd/es/layout/layout";
import styles from './Game.module.css';


export const Game: FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOutcome, setGameOutcome] = useState<'win' | 'loose' | null>(null);
    const [usedCitiesInGame, setUsedCitiesInGame] = useState<string[]>([]);
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
        <Layout className={styles.Container}>
            <Content>
                {gameStarted ? (
                    gameOutcome === 'win' ? (
                        <WinScreen
                            onRestart={onRestartGame}
                            usedCitiesInGame={usedCitiesInGame}
                        />
                    ) : gameOutcome === 'loose' ? (
                        <LooseScreen
                            onRestart={onRestartGame}
                            usedCitiesInGame={usedCitiesInGame}
                        />
                    ) : (
                        <PlayerPage onGameOutcome={handleGameOutcome} setUsedCitiesInGame={setUsedCitiesInGame} />
                    )
                ) : (
                    <StartScreen onStartGame={onStartGame} />
                )}
            </Content>

        </Layout>
    );
};
