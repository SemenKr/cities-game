import {FC, useEffect, useRef, useState} from "react";
import Timer from "src/components/Timer.tsx";
import Chat from "src/components/Chat.tsx";
import CityInput from "src/components/CityInput.tsx";
import cityListData from "src/data/CitiesListData.ts";


enum Turn {
    Player = 'Player',
    Computer = 'Computer',
}

export const PlayerPage: FC = () => {
    const [playerCities, setPlayerCities] = useState<string[]>([]);
    const [lastLetter, setLastLetter] = useState<string>(''); // Добавлено
    const [computerCities, setComputerCities] = useState<string[]>([]);
    const [currentTurn, setCurrentTurn] = useState<Turn>(Turn.Player);
    const [isFirstTurn, setIsFirstTurn] = useState(true);
    const [usedCities, setUsedCities] = useState<string[]>([]);
    const [remainingTime, setRemainingTime] = useState(120); // Время в секундах


    const timerRef = useRef<number | undefined>(undefined);

// Внутри компонента PlayerPage
    useEffect(() => {
        // Выполнится только при монтировании компонента
        setRemainingTime(120);

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
    }, [remainingTime]);

    const handleTimeout = () => {
        // Логика, когда время вышло
        console.log('Время вышло!');
    };

    const getLastLetter = (city: string): string => {
        // Проверяем, если city равен undefined, null или пустой строке
        if (!city) {
            console.error('Город не определен, равен null или является пустой строкой');
            return ''; // или обработайте это так, как имеет смысл для вашего приложения
        }

        // Проверяем, если город заканчивается на 'ъ' или 'ь' и имеет достаточную длину
        if (city.length > 1 && (city.endsWith('ъ') || city.endsWith('ь'))) {
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
    const handleAddCity = (city: string) => {
        console.log(city, usedCities);

        // Проверка, был ли город использован ранее
        if (
            !usedCities.includes(city) &&
            isCityValid(city) &&
            (isFirstTurn || validateLastLetter(city))
        ) {
            setUsedCities((prevCities) => [...prevCities, city]);
            setPlayerCities((prevCities) => [...prevCities, city]);
            setIsFirstTurn(false);
            setLastLetter(getLastLetter(city).toUpperCase());
            console.log(isFirstTurn, currentTurn, lastLetter);
            switchTurn();

            setTimeout(() => {
                handleComputerResponse(city);
            }, 10)


        } else {
            // Город не прошел валидацию
            console.log('Город не прошел валидацию');
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
                setCurrentTurn(Turn.Player);
                setLastLetter(getLastLetter(computerCity));
                switchTurn();
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
        setRemainingTime(120);

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
            <div className="chat">
                <Chat playerCities={playerCities} computerCities={computerCities}/>
            </div>
            <div className="city-input">
                <CityInput
                    onSubmit={handleAddCity}
                    lastLetter={lastLetter}
                />
            </div>
        </>
    );
};
