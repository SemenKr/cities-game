import { FC } from 'react';
import { Button } from "antd";
import styles from './CitySuggestions.module.scss';

interface CitySuggestionsProps {
    suggestions: string[];
    onSelect: (selectedCity: string) => void;
}

const CitySuggestions: FC<CitySuggestionsProps> = ({ suggestions, onSelect }) => {
    if (suggestions.length === 0) {
        return (
            <div className={styles.empty}>
                Подходящих подсказок сейчас нет. Попробуйте изменить ввод или продолжить без подсказки.
            </div>
        );
    }

    return (
        <div className={styles.list}>
            {suggestions.map((city) => (
                <Button
                    key={city}
                    className={styles.suggestion}
                    onClick={() => onSelect(city)}
                >
                    {city}
                </Button>
            ))}
        </div>
    );
};

export default CitySuggestions;
