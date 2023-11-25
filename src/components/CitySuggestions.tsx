// CitySuggestions.tsx

import { FC } from 'react';


interface CitySuggestionsProps {
    suggestions: string[];
    onSelect: (selectedCity: string) => void;
}

const CitySuggestions: FC<CitySuggestionsProps> = ({ suggestions, onSelect }) => {
    return (
        <select onChange={(e) => onSelect(e.target.value)} defaultValue="">
            <option value="" disabled>
                Вы уверены?
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
