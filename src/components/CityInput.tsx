// CityInput
import {ChangeEvent, FC, FormEvent, useRef, useState} from 'react';
import cityListData from "src/data/CitiesListData.ts";
import CitySuggestions from "src/components/CitySuggestions.tsx";
import {Button, Flex, Input, InputRef, Space, Switch} from "antd";
import {SendOutlined} from "@ant-design/icons";


interface CityInputProps {
    onSubmit: (city: string) => void;
    lastLetter: string;
    error: string;
    isDisabled: boolean;
    usedCities: Array<string>
}

const CityInput: FC<CityInputProps> = ({onSubmit, lastLetter, error,isDisabled,usedCities}) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<InputRef>(null);

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
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleSubmit = () => {
        onSubmit(inputValue);
        setInputValue('');
    };

    const filteredCities = cityListData.filter(
        (city) => city.startsWith(lastLetter.toUpperCase()) && !usedCities.includes(city)
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
                <Button disabled={isDisabled} type="primary" onClick={handleSubmit}>
                        <SendOutlined  />
                </Button>
            </Space.Compact>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <Flex vertical gap="middle" style={{padding: '2rem 0', minHeight: '3rem'}}>
                <label htmlFor="showSuggestions" style={{display: 'flex', gap: '1rem', color: 'gray'
                }}>
                    Показать подсказку
                    <Switch
                        id="showSuggestions"
                        checked={showSuggestions}
                        onChange={handleCheckboxChange}
                    />
                </label>
                <div style={{
                    visibility: showSuggestions ? 'visible' : 'hidden',
                    opacity: showSuggestions ? .8 : 0,
                    transition: 'opacity 0.3s easy'
                }}>
                    <CitySuggestions suggestions={filteredCities.slice(0, 10)} onSelect={handleCitySelect}/>
                </div>
            </Flex>

        </form>
    );
};

export default CityInput;
