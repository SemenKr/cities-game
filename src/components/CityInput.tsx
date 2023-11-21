// CityInput
import {ChangeEvent, FC, useEffect, useState} from 'react';

interface CityInputProps {
    onSubmit: (city: string) => void;
    lastLetter: string;
    validateCity: (city: string) => boolean;
    validateLastLetter: (city: string) => boolean;
    isFirstTurn: boolean; // Добавлено

}

const CityInput: FC<CityInputProps> = ({ onSubmit, lastLetter, validateCity, validateLastLetter, isFirstTurn }) => {
    const [city, setCity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        // При изменении lastLetter сбрасываем сообщение об ошибке
        setErrorMessage('');
    }, [lastLetter]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
    };


    const handleSubmit = () => {
        const trimmedCity = city.trim();
        if (trimmedCity !== '') {
            if (validateCity(trimmedCity) && (isFirstTurn || validateLastLetter(trimmedCity))) {
                onSubmit(trimmedCity);
                setCity('');
            } else {
                let errorText = 'Город не прошел валидацию';
                if (!isFirstTurn && !validateLastLetter(trimmedCity)) {
                    errorText += ` или не начинается с буквы "${lastLetter.toUpperCase()}".`;
                }
                setErrorMessage(errorText);
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder={`Введите город (последняя буква: ${lastLetter})`}
                value={city}
                onChange={handleChange}
            />
            <button
                className={'text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'}
                onClick={handleSubmit}>
                Добавить город
            </button>
            <p>Вам на: {lastLetter}</p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default CityInput;
