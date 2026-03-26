// CityInput
import {ChangeEvent, FC, FormEvent, useRef, useState} from 'react';
import cityListData from "src/data/CitiesListData.ts";
import CitySuggestions from "src/components/CitySuggestions.tsx";
import { filterAvailableCities } from "src/lib/cityRules.ts";
import {Button, Flex, Input, InputRef, Space, Switch} from "antd";
import {SendOutlined} from "@ant-design/icons";


interface CityInputProps {
    onSubmit: (city: string) => boolean;
    lastLetter: string;
    error: string;
    isDisabled: boolean;
    usedCities: Array<string>
}

const CityInput: FC<CityInputProps> = ({onSubmit, lastLetter, error,isDisabled,usedCities}) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const formatInputValue = (value: string) => {
        return value.replace(/^(\s*)(\S)/, (_, spaces: string, firstChar: string) => {
            return `${spaces}${firstChar.toUpperCase()}`;
        });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(formatInputValue(e.target.value));
    };
    const handleCitySelect = (selectedCity: string) => {
        setInputValue(selectedCity);
        setShowSuggestions(false);
    };
    const handleCheckboxChange = (checked: boolean) => {
        setShowSuggestions(checked);
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        const isSubmitted = onSubmit(inputValue);

        if (isSubmitted) {
            setInputValue('');
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const filteredCities = filterAvailableCities({
        cities: cityListData,
        requiredLetter: lastLetter,
        usedCities,
        query: inputValue,
    });

    return (
        <form onSubmit={handleFormSubmit} id={'cityForm'} ref={formRef}>

            <Space.Compact style={{ width: '100%' }}>
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    onPressEnter={() => formRef.current?.requestSubmit()}
                    placeholder={lastLetter
                        ? `Введите город на букву "${lastLetter}"`
                        : 'Введите любой город'}
                    ref={inputRef}
                    disabled={isDisabled}
                />
                <Button disabled={isDisabled} type="primary" htmlType="submit">
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
                    transition: 'opacity 0.3s ease'
                }}>
                    <CitySuggestions suggestions={filteredCities.slice(0, 10)} onSelect={handleCitySelect}/>
                </div>
            </Flex>

        </form>
    );
};

export default CityInput;
