import {FC, lazy, Suspense, useEffect, useRef, useState} from "react";
import { GameOutcome } from "src/types/game.ts";
import { ComputerDifficulty } from "src/types/gameSettings.ts";
import { PlayerStats } from "src/types/gameStats.ts";
import { createInitialPlayerStats, PLAYER_STATS_STORAGE_KEY, updatePlayerStats } from "src/lib/gameStats.ts";
import {Layout} from "antd";
import {Content} from "antd/es/layout/layout";
import styles from './Game.module.css';

const StartScreen = lazy(() => import('src/Screens/StartScrean/StartScreen.tsx'));
const PlayerPage = lazy(() =>
    import('src/Screens/PlayerPage/PlayerPage.tsx').then((module) => ({
        default: module.PlayerPage,
    })),
);
const WinScreen = lazy(() => import('src/components/WinScreen.tsx'));
const LooseScreen = lazy(() => import('src/components/LooseScreen.tsx'));

export const Game: FC = () => {
    const loadPlayerStats = (): PlayerStats => {
        if (typeof window === 'undefined') {
            return createInitialPlayerStats();
        }

        const savedStats = window.localStorage.getItem(PLAYER_STATS_STORAGE_KEY);

        if (!savedStats) {
            return createInitialPlayerStats();
        }

        try {
            return {
                ...createInitialPlayerStats(),
                ...JSON.parse(savedStats),
            } satisfies PlayerStats;
        } catch {
            return createInitialPlayerStats();
        }
    };

    const [gameStarted, setGameStarted] = useState(false);
    const [gameOutcome, setGameOutcome] = useState<GameOutcome | null>(null);
    const [usedCitiesInGame, setUsedCitiesInGame] = useState<string[]>([]);
    const [timerDurationSeconds, setTimerDurationSeconds] = useState(120);
    const [computerDifficulty, setComputerDifficulty] = useState<ComputerDifficulty>('medium');
    const [playerStats, setPlayerStats] = useState<PlayerStats>(loadPlayerStats);
    const isOutcomeRecordedRef = useRef(false);

    useEffect(() => {
        window.localStorage.setItem(PLAYER_STATS_STORAGE_KEY, JSON.stringify(playerStats));
    }, [playerStats]);

    const onStartGame = () => {
        setGameStarted(true);
        setGameOutcome(null);
        setUsedCitiesInGame([]);
        isOutcomeRecordedRef.current = false;
    };
    const onRestartGame = () => {
        setGameStarted(false);
        setGameOutcome(null);
        setUsedCitiesInGame([]);
        isOutcomeRecordedRef.current = false;
    };


    const handleGameOutcome = (outcome: GameOutcome) => {
        if (!isOutcomeRecordedRef.current) {
            setPlayerStats((previousStats) => updatePlayerStats({
                previousStats,
                result: outcome.result,
                usedCitiesInGame,
            }));
            isOutcomeRecordedRef.current = true;
        }

        setGameOutcome(outcome);
    };


    return (
        <Layout className={styles.Container}>
            <Content>
                <Suspense fallback={<div className={styles.loader}>Загружаем экран...</div>}>
                    {gameStarted ? (
                        gameOutcome?.result === 'win' ? (
                            <WinScreen
                                onRestart={onRestartGame}
                                usedCitiesInGame={usedCitiesInGame}
                                reason={gameOutcome.reason}
                                playerStats={playerStats}
                            />
                        ) : gameOutcome?.result === 'loose' ? (
                            <LooseScreen
                                onRestart={onRestartGame}
                                usedCitiesInGame={usedCitiesInGame}
                                reason={gameOutcome.reason}
                                playerStats={playerStats}
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
                            playerStats={playerStats}
                        />
                    )}
                </Suspense>
            </Content>

        </Layout>
    );
};
