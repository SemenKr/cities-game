import { FC } from 'react';
import { AutoComplete } from "antd";

interface CitySuggestionsProps {
    suggestions: string[];
    onSelect: (selectedCity: string) => void;
}

const CitySuggestions: FC<CitySuggestionsProps> = ({ suggestions, onSelect }) => {
    const dataSource = suggestions.map(city => ({ value: city }));

    return (
        <AutoComplete
            style={{ width: 200 }}
            onSelect={(value) => onSelect(value)}
            placeholder="Выберите город"
            defaultValue=""
            options={dataSource.map(city => ({ value: city.value }))}
            filterOption={(inputValue, option) =>
                option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        />
    );
};

export default CitySuggestions;
