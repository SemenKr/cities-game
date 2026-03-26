import {FC,} from 'react';
import { AutoComplete } from "antd";

interface CitySuggestionsProps {
    suggestions: string[];
    onSelect: (selectedCity: string) => void;
}

const CitySuggestions: FC<CitySuggestionsProps> = ({ suggestions, onSelect }) => {
    const dataSource = suggestions.map(city => ({ value: city }));

    return (
        <AutoComplete
            style={{ width: '100%' }}
            onSelect={(value) => onSelect(value)}
            placeholder="Выберите город"
            options={dataSource.map(city => ({ value: city.value }))}
        />
    );
};

export default CitySuggestions;
