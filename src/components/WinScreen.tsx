import { FC } from 'react';
import ResultScreen from "src/components/ResultScreen.tsx";
import { GameOutcomeReason } from "src/types/game.ts";


interface WinScreenProps {
    onRestart: () => void
    usedCitiesInGame: string[];
    reason: GameOutcomeReason;
}

const getWinReasonCopy = (reason: GameOutcomeReason) => {
    if (reason === 'computer_no_city') {
        return {
            subtitle: 'Компьютер не смог продолжить цепочку. Раунд завершен в вашу пользу.',
            reasonTitle: 'У компьютера не осталось подходящих городов',
            reasonDescription: 'Цепочка оборвалась на стороне соперника: допустимого следующего города в текущем списке не нашлось.',
        };
    }

    return {
        subtitle: 'Компьютер не уложился в отведенное время на ход. Раунд завершен в вашу пользу.',
        reasonTitle: 'У соперника закончилось время',
        reasonDescription: 'Таймер хода компьютера дошел до нуля до того, как он ответил новым городом.',
    };
};

const WinScreen: FC<WinScreenProps> = ({onRestart, usedCitiesInGame, reason}) => {
    const copy = getWinReasonCopy(reason);

    return (
        <ResultScreen
            onRestart={onRestart}
            usedCitiesInGame={usedCitiesInGame}
            title="Победа"
            subtitle={copy.subtitle}
            variant="win"
            reasonTitle={copy.reasonTitle}
            reasonDescription={copy.reasonDescription}
        />
    );
};

export default WinScreen;
