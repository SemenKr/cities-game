// CitySuggestions.tsx

import { FC } from 'react';

interface CitySuggestionsProps {
    suggestions: string[];
    onSelect: (selectedCity: string) => void;
}

const CitySuggestions: FC<CitySuggestionsProps> = ({ suggestions, onSelect }) => {
    return (
        <select onChange={(e) => onSelect(e.target.value)}>
            <option value="" disabled selected>
                Select a city
            </option>
            {suggestions.map((city) => (
                <option key={city} value={city}>
                    {city}
                </option>
            ))}
        </select>
    );
};

export default CitySuggestions;
