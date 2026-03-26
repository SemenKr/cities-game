import { FC } from 'react';
import ResultScreen from "src/components/ResultScreen.tsx";
import { GameOutcomeReason } from "src/types/game.ts";
import { PlayerStats } from "src/types/gameStats.ts";

interface LooseScreenProps {
    onRestart: () => void;
    usedCitiesInGame: string[];
    reason: GameOutcomeReason;
    playerStats: PlayerStats;
}

const getLooseReasonCopy = (reason: GameOutcomeReason) => {
    if (reason === 'player_timeout') {
        return {
            subtitle: 'Ваше время закончилось раньше следующего хода. Можно сразу начать новый раунд.',
            reasonTitle: 'Ваш таймер дошел до нуля',
            reasonDescription: 'Вы не успели ввести следующий город до окончания своего хода, поэтому партия завершилась поражением.',
        };
    }

    return {
        subtitle: 'Раунд завершился поражением. Можно сразу начать новый раунд.',
        reasonTitle: 'Партия завершилась на вашей стороне',
        reasonDescription: 'Текущий сценарий окончания игры был засчитан как поражение игрока.',
    };
};

const LooseScreen: FC<LooseScreenProps> = ({onRestart, usedCitiesInGame, reason, playerStats}) => {
    const copy = getLooseReasonCopy(reason);

    return (
        <ResultScreen
            onRestart={onRestart}
            usedCitiesInGame={usedCitiesInGame}
            title="Поражение"
            subtitle={copy.subtitle}
            variant="loose"
            reasonTitle={copy.reasonTitle}
            reasonDescription={copy.reasonDescription}
            playerStats={playerStats}
        />
    );
};

export default LooseScreen
