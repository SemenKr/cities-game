// CityInput
import {ChangeEvent, FC, FormEvent, useState} from 'react';
import cityListData from "src/data/CitiesListData.ts";
import CitySuggestions from "src/components/CitySuggestions.tsx";
import {Button, Input, Space} from "antd";

interface CityInputProps {
    onSubmit: (city: string) => void;
    lastLetter: string;
    error: string;
}

const CityInput: FC<CityInputProps> = ({ onSubmit, lastLetter, error }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);


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

    const filteredCities = cityListData.filter(
        (city) => city.startsWith(lastLetter.toUpperCase()) && !inputValue.toLowerCase().includes(city.toLowerCase())
    );

    return (
        <form onSubmit={handleFormSubmit}>

            <Space.Compact style={{ width: '100%' }}>
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={`Enter a city starting with "${lastLetter}"`} />
                <Button type="primary" >Submit</Button>
            </Space.Compact>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
            <label>
                Show Suggestions
                <input type="checkbox" checked={showSuggestions} onChange={handleCheckboxChange}/>
            </label>
            {showSuggestions &&
                <CitySuggestions suggestions={filteredCities.slice(0, 10)} onSelect={handleCitySelect}/>}
        </form>
    );
};

export default CityInput;
