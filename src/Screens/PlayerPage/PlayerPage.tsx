import { FC, useEffect, useRef, useState, useCallback, CSSProperties } from "react";
import Timer from "src/components/Timer.tsx";
import Chat from "src/components/Chat.tsx";
import CityInput from "src/components/CityInput.tsx";
import cityListData from "src/data/CitiesListData.ts";
import {Progress, Layout, Typography, Tag} from "antd";

const { Title } = Typography;
const TIMER_DURATION_SECONDS = 120; // Вы можете настроить продолжительность по мере необходимости


const { Header, Footer, Content } = Layout;

const headerStyle: CSSProperties = {
    padding: 0,
    backgroundColor: 'inherit',
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

};
const mobileHeaderStyle: CSSProperties = {
    flexDirection: "column",
};
const contentStyle: CSSProperties = {

};
const footerStyle: CSSProperties = {
    backgroundColor: 'inherit',
    padding: '2rem 0 0',
    position: 'relative'
};
enum Turn {
    Player = 'Player',
    Computer = 'Computer',
}


export const PlayerPage: FC<{
    onGameOutcome: (outcome: 'win' | 'loose') => void;
    setUsedCitiesInGame: (cities: string[]) => void;
}> = ({ onGameOutcome, setUsedCitiesInGame }) => {
    const [lastLetter, setLastLetter] = useState<string>('');
    const [currentTurn, setCurrentTurn] = useState<Turn>(Turn.Player);
    const [isFirstTurn, setIsFirstTurn] = useState(true);
    const [usedCities, setUsedCities] = useState<string[]>([]);
    const [remainingTime, setRemainingTime] = useState(TIMER_DURATION_SECONDS);
    const [error, setError] = useState<string>('');
    const [isCityInputDisabled, setIsCityInputDisabled] = useState(false);

    const timerRef = useRef<number | undefined>(undefined);
    const computerMoveTimeoutRef = useRef<number | undefined>(undefined);
    const usedCitiesRef = useRef<string[]>([]);

    const handleTimeout = useCallback(() => {
        if (currentTurn === Turn.Player) {
            onGameOutcome('loose');
        } else {
            onGameOutcome('win');
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
        setRemainingTime(TIMER_DURATION_SECONDS);
        setIsCityInputDisabled(currentTurn === Turn.Computer);
        clearInterval(timerRef.current);

        timerRef.current = window.setInterval(() => {
            setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
        };
    }, [currentTurn, handleTimeout]);

    useEffect(() => {
        if (remainingTime !== 0) {
            return;
        }

        clearInterval(timerRef.current);
        handleTimeout();
    }, [remainingTime, handleTimeout]);

    const getLastLetter = (city: string): string => {
        if (!city) {
            return '';
        }

        if (city.length > 1 && (city.endsWith('ъ') || city.endsWith('й') || city.endsWith('ь') || city.endsWith('ы'))) {
            return city[city.length - 2].toUpperCase();
        }

        return city[city.length - 1].toUpperCase();
    };

    const isCityValid = (city: string) => {
        return cityListData.includes(city);
    };

    const validateLastLetter = (city: string) => {
        if (!city) {
            return false;
        }

        const firstCityLetter = city[0];
        return lastLetter === firstCityLetter;
    };

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
            const computerCity = cityListData.find((candidate) => {
                return candidate.startsWith(lastPlayerCityLetter) && !usedCitiesRef.current.includes(candidate);
            });

            if (!computerCity) {
                onGameOutcome('win');
                return;
            }

            const nextCities = [...usedCitiesRef.current, computerCity];
            syncUsedCities(nextCities);
            setLastLetter(getLastLetter(computerCity));
            setCurrentTurn(Turn.Player);
        }, delay);
    };

    const handleAddCity = (inputCity: string) => {
        const city = inputCity.trim();

        if (!city) {
            setError('Введите название города.');
            return;
        }

        if (usedCitiesRef.current.includes(city)) {
            setError('Город использовался ранее. Пожалуйста, войдите в новый город.');
            return;
        }

        if (!isCityValid(city)) {
            setError('Недействительный город. Такого города нет в базе :(.');
            return;
        }

        if (!isFirstTurn && !validateLastLetter(city)) {
            setError(`Город должен начинаться с ${lastLetter}.`);
            return;
        }

        const nextCities = [...usedCitiesRef.current, city];
        syncUsedCities(nextCities);
        setIsFirstTurn(false);
        setLastLetter(getLastLetter(city));
        setError('');
        setCurrentTurn(Turn.Computer);
        handleComputerResponse(city);
    };

    return (
        <>
            <Header style={window.innerWidth <= 480 ? {...headerStyle, ...mobileHeaderStyle} : headerStyle}>
                <Title level={3}>
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
                percent={(remainingTime / TIMER_DURATION_SECONDS) * 100}
                showInfo={false}
                strokeColor={'#9e68d0'}
            />

            <Content style={contentStyle}>
                <Chat usedCities={usedCities} />
            </Content>
            <Footer style={footerStyle} className="city-input">
                <CityInput
                    onSubmit={handleAddCity}
                    lastLetter={lastLetter}
                    error={error}
                    isDisabled={isCityInputDisabled}
                    usedCities={usedCities}
                />
                <Tag style={{position:"absolute", bottom:'3rem', right: '0' }}  color="#9e68d0">{usedCities.length}</Tag>
            </Footer>
        </>
    );
};
