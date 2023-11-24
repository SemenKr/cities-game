import {FC, useEffect, useRef, useState, useCallback } from "react";
import Timer from "src/components/Timer.tsx";
import Chat from "src/components/Chat.tsx";
import CityInput from "src/components/CityInput.tsx";
import cityListData from "src/data/CitiesListData.ts";
import {Progress} from "antd";


enum Turn {
    Player = 'Player',
    Computer = 'Computer',
}

const TIMER_DURATION_SECONDS = 60; // You can adjust the duration as needed


export const PlayerPage: FC<{
    onGameOutcome: (outcome: 'win' | 'loose') => void
}> = ({ onGameOutcome }) => {
    const [playerCities, setPlayerCities] = useState<string[]>([]);
    const [lastLetter, setLastLetter] = useState<string>(''); // Добавлено
    const [computerCities, setComputerCities] = useState<string[]>([]);
    const [currentTurn, setCurrentTurn] = useState<Turn>(Turn.Player);
    const [isFirstTurn, setIsFirstTurn] = useState(true);
    const [usedCities, setUsedCities] = useState<string[]>([]);
    const [remainingTime, setRemainingTime] = useState(TIMER_DURATION_SECONDS); // Время в секундах
    const [error, setError] = useState<string>('');


    const timerRef = useRef<number | undefined>(undefined);
    const handleTimeout = useCallback(() => {
        console.log('Время вышло!');
        // Проверьте текущий ход и установите результат игры соответствующим образом
        if (currentTurn === Turn.Player) {
            // Player's turn, so the player loses
            console.log('Вы проиграли!');
            onGameOutcome('loose');
        } else if (currentTurn === Turn.Computer) {
            // Очередь компьютера, чтобы игрок выиграл
            console.log('Вы победили!');
            onGameOutcome('win');
        }
        // Дополнительная логика при необходимости
    }, [currentTurn, onGameOutcome]);

    useEffect(() => {
        // Выполнится только при монтировании компонента
        setRemainingTime(TIMER_DURATION_SECONDS);

        return () => {
            // Выполнится при размонтировании компонента (например, при завершении игры)
            clearInterval(timerRef.current);
        };
    }, []); // Пустой массив зависимостей, чтобы useEffect сработал только при монтировании

    useEffect(() => {
        // Выполнится при каждом обновлении remainingTime
        if (remainingTime > 0) {
            // Останавливаем текущий таймер, если он существует
            if (timerRef.current !== undefined) {
                clearInterval(timerRef.current);
            }

            // Запуск нового таймера
            timerRef.current = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            handleTimeout();
        }

        return () => {
            // Выполнится при размонтировании компонента (например, при завершении игры)
            clearInterval(timerRef.current);
        };
    }, [remainingTime, handleTimeout]);


    const getLastLetter = (city: string): string => {
        // Проверяем, если city равен undefined, null или пустой строке
        if (!city) {
            console.error('Город не определен, равен null или является пустой строкой');
            return ''; // или обработайте это так, как имеет смысл для вашего приложения
        }

        // Проверяем, если город заканчивается на 'ъ' или 'ь' и имеет достаточную длину
        if (city.length > 1 && (city.endsWith('ъ') || city.endsWith('ь') || city.endsWith('ы'))) {
            return city[city.length - 2].toUpperCase();
        }

        // Возвращаем последнюю букву по умолчанию
        return city[city.length - 1].toUpperCase();
    };

    const isCityValid = (city: string) => {
        return cityListData.includes(city);
    };

    const validateLastLetter = (city: string) => {
        // Проверяем, если city равен undefined, null или пустой строке
        if (!city) {
            console.error('Город не определен, равен null или является пустой строкой');
            return false;
        }

        // Получаем первую букву города
        const firstCityLetter = city[0];

        // Возвращаем результат сравнения
        return lastLetter === firstCityLetter;
    };

    const handleAddCity = (inputCity: string) => {
        const city = inputCity.trim();

        if (!usedCities.includes(city)) {
            if (!isCityValid(city)) {
                setError('Недействительный город. NТакого города нет в базе :(.');
            } else if (!isFirstTurn && !validateLastLetter(city)) {
                setError(`Город должен начинаться с ${lastLetter}.`);
            } else {
                setUsedCities((prevCities) => [...prevCities, city]);
                setPlayerCities((prevCities) => [...prevCities, city]);
                setIsFirstTurn(false);
                setLastLetter(getLastLetter(city).toUpperCase());
                switchTurn();

                setTimeout(() => {
                    handleComputerResponse(city);
                }, 10);

                setError(''); // Clear the error
            }
        } else {
            setError('Город использовался ранее. Пожалуйста, войдите в новый город.');
        }
    };

    const handleComputerResponse = (city: string) => {
        const lastPlayerCityLetter = getLastLetter(city);
        // Добавим задержку от 3 до 5 секунд
        const delay = Math.floor(Math.random() * (5000 - 3000 + 1) + 3000);

        // Используем setTimeout для установки задержки
        setTimeout(() => {
            // Найдем подходящий город для ответа компьютера
            const computerCity = cityListData.find(city => {
                return city.startsWith(lastPlayerCityLetter.toUpperCase()) && !usedCities.includes(city);
            });

            if (computerCity) {
                setUsedCities(prevCities => [...prevCities, computerCity]);
                setComputerCities(prevCities => [...prevCities, computerCity]);
                setLastLetter(getLastLetter(computerCity));
                switchTurn();
                setCurrentTurn(Turn.Player);
            } else {
                // Логика, если компьютер не может найти подходящий город
                console.log('Компьютер не может найти подходящий город.');
                //handleGameOver(); // Можно вызвать завершение игры в этом случае
            }
        }, delay);
    };

    // Внутри функции switchTurn
    const switchTurn = () => {
        // Останавливаем текущий таймер, если он существует
        if (timerRef.current !== undefined) {
            clearInterval(timerRef.current);
        }

        // Переключение хода между игроком и компьютером
        setCurrentTurn((prevTurn) =>
            prevTurn === Turn.Player ? Turn.Computer : Turn.Player
        );

        // Сброс таймера на 120 секунд
        setRemainingTime(TIMER_DURATION_SECONDS);

        // Запуск нового таймера
        timerRef.current = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);
    };


    return (
        <>
            <div className="header">
                <h1>Сейчас ваша очередь</h1>
                <Timer onTimeout={handleTimeout} isPlayerTurn={true} minutes={Math.floor(remainingTime / 60)}
                       seconds={remainingTime % 60}/>
            </div>
            <Progress
                percent={(remainingTime / TIMER_DURATION_SECONDS) * 100}
                showInfo={false}
                strokeColor={'#9e68d0'}
            />

            <div className="chat">
                <Chat playerCities={playerCities} computerCities={computerCities}/>
            </div>
            <div className="city-input">
                <CityInput
                    onSubmit={handleAddCity}
                    lastLetter={lastLetter}
                    error={error} // Pass the error to CityInput
                />
            </div>
        </>
    );
};
