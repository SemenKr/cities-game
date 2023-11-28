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
    justifyContent: "space-between"
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
    const [timerKey, setTimerKey] = useState(0); // Add timerKey state

    const timerRef = useRef<number | undefined>(undefined);
    const handleTimeout = useCallback(() => {
        if (currentTurn === Turn.Player) {
            onGameOutcome('loose');
        } else if (currentTurn === Turn.Computer) {
            onGameOutcome('win');
        }
    }, [currentTurn, onGameOutcome]);

    useEffect(() => {
        setRemainingTime(TIMER_DURATION_SECONDS);

        return () => {
            clearInterval(timerRef.current);
        };
    }, [timerKey]); // Include timerKey in the dependency array

    useEffect(() => {
        if (remainingTime > 0) {
            if (timerRef.current !== undefined) {
                clearInterval(timerRef.current);
            }

            timerRef.current = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            handleTimeout();
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [remainingTime, handleTimeout, timerKey]); // Include timerKey in the dependency array

    const getLastLetter = (city: string): string => {
        if (!city) {
            console.error('Город не определен, равен null или является пустой строкой');
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
            console.error('Город не определен, равен null или является пустой строкой');
            return false;
        }

        const firstCityLetter = city[0];
        return lastLetter === firstCityLetter;
    };

    const handleAddCity = (inputCity: string) => {
        const city = inputCity.trim();

        if (!usedCities.includes(city)) {
            if (!isCityValid(city)) {
                setError('Недействительный город. Такого города нет в базе :(.');
            } else if (!isFirstTurn && !validateLastLetter(city)) {
                setError(`Город должен начинаться с ${lastLetter}.`);
            } else {
                setUsedCities((prevCities) => {
                    const newCities = [...prevCities, city];
                    setUsedCitiesInGame(newCities);  // Обновление usedCitiesInGame
                    return newCities;
                });
                setIsFirstTurn(false);
                setLastLetter(getLastLetter(city).toUpperCase());
                switchTurn();

                setTimeout(() => {
                    handleComputerResponse(city);
                }, 10);

                setError('');
            }
        } else {
            setError('Город использовался ранее. Пожалуйста, войдите в новый город.');
        }
    };

    const handleComputerResponse = (city: string) => {
        const lastPlayerCityLetter = getLastLetter(city);
        const delay = Math.floor(Math.random() * (5000 - 3000 + 1) + 3000);

        setTimeout(() => {
            const computerCity = cityListData.find(city => {
                return city.startsWith(lastPlayerCityLetter.toUpperCase()) && !usedCities.includes(city);
            });

            if (computerCity) {
                setUsedCities((prevCities) => {
                    const newCities = [...prevCities, city];
                    setUsedCitiesInGame(newCities);  // Обновление usedCitiesInGame
                    return newCities;
                });
                setLastLetter(getLastLetter(computerCity));
                switchTurn();
                setCurrentTurn(Turn.Player);
            } else {
                console.log('Компьютер не может найти подходящий город.');
            }
        }, delay);
    };

    const switchTurn = () => {
        if (timerRef.current !== undefined) {
            clearInterval(timerRef.current);
        }

        setCurrentTurn((prevTurn) => {
            const newTurn = prevTurn === Turn.Player ? Turn.Computer : Turn.Player;

            setRemainingTime(TIMER_DURATION_SECONDS);

            const isDisabled = newTurn === Turn.Computer;
            setIsCityInputDisabled(isDisabled);

            // Increment the timerKey to trigger a Timer component remount
            setTimerKey((prevKey) => prevKey + 1);

            return newTurn;
        });
    };

    return (
        <>
            <Header style={headerStyle}>
                <Title level={3}>
                    {currentTurn === Turn.Player
                        ? 'Сейчас ваша очередь'
                        : 'Сейчас ход компьютера'}
                </Title>
                <Timer
                    key={timerKey}
                    onTimeout={handleTimeout}
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
