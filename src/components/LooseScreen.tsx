import { FC } from 'react';
import ResultScreen from "src/components/ResultScreen.tsx";

interface LooseScreenProps {
    onRestart: () => void;
    usedCitiesInGame: string[];
}

const LooseScreen: FC<LooseScreenProps> = ({onRestart, usedCitiesInGame}) => {
    return (
        <ResultScreen
            onRestart={onRestart}
            usedCitiesInGame={usedCitiesInGame}
            title="Поражение"
            subtitle="Ваше время закончилось раньше следующего хода. Можно сразу начать новый раунд."
            variant="loose"
        />
    );
};

export default LooseScreen
