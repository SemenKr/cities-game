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
        if (remainingTime === 0) {
            clearInterval(timerRef.current);
            handleTimeout();
        }
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
            return city[city.length - 2];
        }

        // Возвращаем последнюю букву по умолчанию
        return city[city.length - 1];
    };



    const isCityValid = (city: string) => {
        return cityListData.includes(city);
    };
    const validateLastLetter = (city: string) => {
        const lastCityLetter = getLastLetter(city)

        return lastCityLetter === lastLetter;
    };
    const handleAddCity = (city: string) => {
        console.log(city, usedCities);
        const trimmedCity = city.trim();

        // Проверка, был ли город использован ранее
        if (
            !usedCities.includes(trimmedCity) &&
            isCityValid(trimmedCity) &&
            (isFirstTurn || validateLastLetter(trimmedCity))
        ) {
            setUsedCities((prevCities) => [...prevCities, trimmedCity]);
            setPlayerCities((prevCities) => [...prevCities, trimmedCity]);
            setCurrentTurn(Turn.Computer);
            setIsFirstTurn(false);
            switchTurn();

            const lastLetter = getLastLetter(trimmedCity).toUpperCase();

            setLastLetter(lastLetter);
            console.log(isFirstTurn, currentTurn, lastLetter);

            // Добавим валидацию последней буквы для следующего хода
            if (!validateLastLetter(trimmedCity)) {
                console.log(`Город должен начинаться с буквы "${lastLetter}"`);
            }

            // Вызываем функцию для ответа компьютера с небольшой задержкой
            setTimeout(() => {
                handleComputerResponse();
            }, 1000); // Измените значение задержки по вашему усмотрению
        } else {
            // Город не прошел валидацию
            console.log('Город не прошел валидацию');
        }
    };


    const handleComputerResponse = () => {
        const lastPlayerCity = playerCities[playerCities.length - 1];
        const lastPlayerCityLetter = getLastLetter(lastPlayerCity);

        // Добавим задержку от 3 до 15 секунд
        const delay = Math.floor(Math.random() * (15000 - 3000 + 1) + 3000);

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
                switchTurn();
                setLastLetter(getLastLetter(computerCity));
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
        // Запуск нового таймера
        timerRef.current = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);
    };



    return (
        <>
            <div className="header">
                <h1>Сейчас ваша очередь</h1>
                <Timer onTimeout={handleTimeout} isPlayerTurn={true} />
            </div>
            <div className="chat">
                <Chat playerCities={playerCities} computerCities={computerCities} />
            </div>
            <div className="city-input">
                <CityInput
                    onSubmit={handleAddCity}
                    lastLetter={lastLetter}
                    validateCity={isCityValid}
                    validateLastLetter={validateLastLetter}
                    isFirstTurn={isFirstTurn}

                />
            </div>
        </>
    );
};
