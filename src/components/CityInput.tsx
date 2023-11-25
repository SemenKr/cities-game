// CityInput
import {ChangeEvent, FC, FormEvent, useRef, useState} from 'react';
import cityListData from "src/data/CitiesListData.ts";
import CitySuggestions from "src/components/CitySuggestions.tsx";
import {Button, Input, InputRef, Space} from "antd";

interface CityInputProps {
    onSubmit: (city: string) => void;
    lastLetter: string;
    error: string;
    isDisabled: boolean;
}

const CityInput: FC<CityInputProps> = ({onSubmit, lastLetter, error,isDisabled}) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<InputRef>(null);

    console.log('isDisabled in CityInput:', isDisabled); // Добавьте этот лог


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleCitySelect = (selectedCity: string) => {
        setInputValue(selectedCity);
        setShowSuggestions(false);
    };
    const handleCheckboxChange = () => {
        setShowSuggestions(!showSuggestions);
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(inputValue);
        setInputValue('');
    };

    const handleSubmit = () => {
        onSubmit(inputValue);
        setInputValue('');
    };

    const filteredCities = cityListData.filter(
        (city) => city.startsWith(lastLetter.toUpperCase()) && !inputValue.toLowerCase().includes(city.toLowerCase())
    );

    return (
        <form onSubmit={handleFormSubmit} id={'cityForm'}>

            <Space.Compact style={{ width: '100%' }}>
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={`Введите город на букву "${lastLetter}"`}
                    ref={inputRef}
                    disabled={isDisabled}
                />
                <Button disabled={isDisabled} type="primary" onClick={handleSubmit}>Submit</Button>
            </Space.Compact>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <label htmlFor="showSuggestions">
                Показать подсказку
                <input
                    id="showSuggestions"
                    type="checkbox"
                    checked={showSuggestions}
                    onChange={handleCheckboxChange}
                />
            </label>
            {showSuggestions &&
                <CitySuggestions suggestions={filteredCities.slice(0, 10)} onSelect={handleCitySelect}/>}
        </form>
    );
};

export default CityInput;
