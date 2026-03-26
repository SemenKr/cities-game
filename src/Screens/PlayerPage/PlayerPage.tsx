import { FC, useEffect, useRef, useState, useCallback } from "react";
import Timer from "src/components/Timer.tsx";
import Chat from "src/components/Chat.tsx";
import CityInput from "src/components/CityInput.tsx";
import cityListData from "src/data/CitiesListData.ts";
import { chooseComputerCity, findCanonicalCity, getLastLetter, hasCityBeenUsed, matchesRequiredLetter, normalizeCity } from "src/lib/cityRules.ts";
import { GameOutcome } from "src/types/game.ts";
import { ComputerDifficulty } from "src/types/gameSettings.ts";
import {Progress, Layout, Typography, Tag} from "antd";
import styles from "./PlayerPage.module.scss";

const { Title } = Typography;

const { Header, Footer, Content } = Layout;

enum Turn {
    Player = 'Player',
    Computer = 'Computer',
}


export const PlayerPage: FC<{
    onGameOutcome: (outcome: GameOutcome) => void;
    setUsedCitiesInGame: (cities: string[]) => void;
    timerDurationSeconds: number;
    computerDifficulty: ComputerDifficulty;
}> = ({ onGameOutcome, setUsedCitiesInGame, timerDurationSeconds, computerDifficulty }) => {
    const [lastLetter, setLastLetter] = useState<string>('');
    const [currentTurn, setCurrentTurn] = useState<Turn>(Turn.Player);
    const [isFirstTurn, setIsFirstTurn] = useState(true);
    const [usedCities, setUsedCities] = useState<string[]>([]);
    const [remainingTime, setRemainingTime] = useState(timerDurationSeconds);
    const [error, setError] = useState<string>('');
    const [isCityInputDisabled, setIsCityInputDisabled] = useState(false);

    const timerRef = useRef<number | undefined>(undefined);
    const computerMoveTimeoutRef = useRef<number | undefined>(undefined);
    const usedCitiesRef = useRef<string[]>([]);

    const handleTimeout = useCallback(() => {
        if (currentTurn === Turn.Player) {
            onGameOutcome({
                result: 'loose',
                reason: 'player_timeout',
            });
        } else {
            onGameOutcome({
                result: 'win',
                reason: 'computer_timeout',
            });
        }
    }, [currentTurn, onGameOutcome]);

    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
            clearTimeout(computerMoveTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        usedCitiesRef.current = usedCities;
    }, [usedCities]);

    useEffect(() => {
        setRemainingTime(timerDurationSeconds);
        setIsCityInputDisabled(currentTurn === Turn.Computer);
        clearInterval(timerRef.current);

        timerRef.current = window.setInterval(() => {
            setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
        };
    }, [currentTurn, handleTimeout, timerDurationSeconds]);

    useEffect(() => {
        if (remainingTime !== 0) {
            return;
        }

        clearInterval(timerRef.current);
        handleTimeout();
    }, [remainingTime, handleTimeout]);

    const syncUsedCities = (nextCities: string[]) => {
        usedCitiesRef.current = nextCities;
        setUsedCities(nextCities);
        setUsedCitiesInGame(nextCities);
    };

    const handleComputerResponse = (city: string) => {
        clearTimeout(computerMoveTimeoutRef.current);

        const lastPlayerCityLetter = getLastLetter(city);
        const delay = Math.floor(Math.random() * (5000 - 3000 + 1) + 3000);

        computerMoveTimeoutRef.current = window.setTimeout(() => {
            const computerCity = chooseComputerCity({
                cities: cityListData,
                requiredLetter: lastPlayerCityLetter,
                usedCities: usedCitiesRef.current,
                difficulty: computerDifficulty,
            });

            if (!computerCity) {
                onGameOutcome({
                    result: 'win',
                    reason: 'computer_no_city',
                });
                return;
            }

            const nextCities = [...usedCitiesRef.current, computerCity];
            syncUsedCities(nextCities);
            setLastLetter(getLastLetter(computerCity));
            setCurrentTurn(Turn.Player);
        }, delay);
    };

    const handleAddCity = (inputCity: string) => {
        const normalizedInput = normalizeCity(inputCity);

        if (!normalizedInput) {
            setError('Введите название города.');
            return false;
        }

        const city = findCanonicalCity(inputCity, cityListData);

        if (!city) {
            setError('Недействительный город. Такого города нет в базе :(.');
            return false;
        }

        if (hasCityBeenUsed(city, usedCitiesRef.current)) {
            setError('Город использовался ранее. Пожалуйста, войдите в новый город.');
            return false;
        }

        if (!isFirstTurn && !matchesRequiredLetter(city, lastLetter)) {
            setError(`Город должен начинаться с ${lastLetter}.`);
            return false;
        }

        const nextCities = [...usedCitiesRef.current, city];
        syncUsedCities(nextCities);
        setIsFirstTurn(false);
        setLastLetter(getLastLetter(city));
        setError('');
        setCurrentTurn(Turn.Computer);
        handleComputerResponse(city);
        return true;
    };

    const handleInputChange = () => {
        if (error) {
            setError('');
        }
    };

    const isComputerThinking = currentTurn === Turn.Computer;
    const statusText = isComputerThinking
        ? `Компьютер подбирает ответ на букву "${lastLetter}".`
        : lastLetter
            ? `Введите город на букву "${lastLetter}".`
            : 'Начните игру с любого города.';

    return (
        <>
            <Header className={styles.header}>
                <Title level={3} className={styles.title}>
                    {currentTurn === Turn.Player
                        ? 'Сейчас ваша очередь'
                        : 'Сейчас ход компьютера'}
                </Title>
                <Timer
                    minutes={Math.floor(remainingTime / 60)}
                    seconds={remainingTime % 60}
                />
            </Header>
            <Progress
                percent={(remainingTime / timerDurationSeconds) * 100}
                showInfo={false}
                strokeColor={'#9e68d0'}
            />
            <div className={styles.statusBar}>
                <div className={styles.statusMeta}>
                    <div className={styles.statusText}>{statusText}</div>
                    <div className={styles.statusHint}>
                        {isComputerThinking ? (
                            <span className={styles.thinkingInline} aria-hidden="true">
                                <span />
                                <span />
                                <span />
                            </span>
                        ) : (
                            'Подсказки ниже учитывают уже использованные города и текущую букву.'
                        )}
                    </div>
                </div>
                <Tag color={isComputerThinking ? 'processing' : 'success'}>
                    {isComputerThinking ? 'Компьютер думает' : 'Ваш ход'}
                </Tag>
            </div>

            <Content className={styles.content}>
                <Chat
                    usedCities={usedCities}
                    isComputerThinking={isComputerThinking}
                    pendingLetter={lastLetter}
                />
            </Content>
            <Footer className={styles.footer}>
                <CityInput
                    onSubmit={handleAddCity}
                    onChangeInput={handleInputChange}
                    lastLetter={lastLetter}
                    error={error}
                    isDisabled={isCityInputDisabled}
                    usedCities={usedCities}
                />
                <Tag className={styles.counter} color="#9e68d0">{usedCities.length}</Tag>
            </Footer>
        </>
    );
};
