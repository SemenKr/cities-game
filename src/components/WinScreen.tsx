import { FC } from 'react';
import ResultScreen from "src/components/ResultScreen.tsx";


interface WinScreenProps {
    onRestart: () => void
    usedCitiesInGame: string[];
}

const WinScreen: FC<WinScreenProps> = ({onRestart, usedCitiesInGame}) => {
    return (
        <ResultScreen
            onRestart={onRestart}
            usedCitiesInGame={usedCitiesInGame}
            title="Победа"
            subtitle="Компьютер не смог продолжить цепочку. Раунд завершен в вашу пользу."
            variant="win"
        />
    );
};

export default WinScreen;
