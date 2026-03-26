// CityInput
import {ChangeEvent, FC, FormEvent, useRef, useState} from 'react';
import cityListData from "src/data/CitiesListData.ts";
import CitySuggestions from "src/components/CitySuggestions.tsx";
import { filterAvailableCities } from "src/lib/cityRules.ts";
import {Button, Input, InputRef, Space, Switch, Tag} from "antd";
import {SendOutlined} from "@ant-design/icons";
import styles from './CityInput.module.scss';


interface CityInputProps {
    onSubmit: (city: string) => boolean;
    onChangeInput: () => void;
    lastLetter: string;
    error: string;
    isDisabled: boolean;
    usedCities: Array<string>
}

const CityInput: FC<CityInputProps> = ({onSubmit, onChangeInput, lastLetter, error,isDisabled,usedCities}) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<InputRef>(null);

    const formatInputValue = (value: string) => {
        return value.replace(/^(\s*)(\S)/, (_, spaces: string, firstChar: string) => {
            return `${spaces}${firstChar.toUpperCase()}`;
        });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(formatInputValue(e.target.value));
        onChangeInput();
    };
    const handleCitySelect = (selectedCity: string) => {
        setInputValue(selectedCity);
        setShowSuggestions(false);
        onChangeInput();
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
        <form onSubmit={handleFormSubmit} id={'cityForm'} className={styles.form}>

            <Space.Compact className={styles.submitRow}>
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
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
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.suggestionsPanel}>
                <div className={styles.suggestionsHeader}>
                    <div className={styles.suggestionsMeta}>
                        <div className={styles.suggestionsTitle}>
                            Подсказки по ходу
                            {lastLetter ? ` на букву "${lastLetter}"` : ''}
                        </div>
                        <div className={styles.suggestionsHint}>
                            Показаны первые подходящие города с учетом уже использованных вариантов.
                        </div>
                    </div>
                    <Tag color={showSuggestions ? 'processing' : 'default'}>
                        {filteredCities.length} доступно
                    </Tag>
                </div>
                <label htmlFor="showSuggestions" className={styles.suggestionsToggle}>
                    Показать подсказку
                    <Switch
                        id="showSuggestions"
                        checked={showSuggestions}
                        onChange={handleCheckboxChange}
                    />
                </label>
                <div className={showSuggestions ? undefined : styles.suggestionsPanelHidden}>
                    <CitySuggestions suggestions={filteredCities.slice(0, 10)} onSelect={handleCitySelect}/>
                </div>
            </div>

        </form>
    );
};

export default CityInput;
