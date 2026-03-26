import { GameResult } from "src/types/game.ts";
import { PlayerStats, RoundStats } from "src/types/gameStats.ts";

export const PLAYER_STATS_STORAGE_KEY = 'cities-game-player-stats';

export const createInitialPlayerStats = (): PlayerStats => ({
    totalGames: 0,
    wins: 0,
    losses: 0,
    bestRoundCities: 0,
    totalCitiesPlayed: 0,
    currentStreakType: null,
    currentStreakCount: 0,
});

export const getRoundStats = (usedCitiesInGame: string[]): RoundStats => {
    const totalCities = usedCitiesInGame.length;

    return {
        totalCities,
        playerCities: Math.ceil(totalCities / 2),
        computerCities: Math.floor(totalCities / 2),
        lastCity: usedCitiesInGame[usedCitiesInGame.length - 1] ?? null,
    };
};

export const updatePlayerStats = ({
    previousStats,
    result,
    usedCitiesInGame,
}: {
    previousStats: PlayerStats;
    result: GameResult;
    usedCitiesInGame: string[];
}) => {
    const roundStats = getRoundStats(usedCitiesInGame);
    const streakCount = previousStats.currentStreakType === result
        ? previousStats.currentStreakCount + 1
        : 1;

    return {
        totalGames: previousStats.totalGames + 1,
        wins: previousStats.wins + (result === 'win' ? 1 : 0),
        losses: previousStats.losses + (result === 'loose' ? 1 : 0),
        bestRoundCities: Math.max(previousStats.bestRoundCities, roundStats.totalCities),
        totalCitiesPlayed: previousStats.totalCitiesPlayed + roundStats.totalCities,
        currentStreakType: result,
        currentStreakCount: streakCount,
    } satisfies PlayerStats;
};

export const getAverageCitiesPerRound = (stats: PlayerStats) => {
    if (stats.totalGames === 0) {
        return 0;
    }

    return Number((stats.totalCitiesPlayed / stats.totalGames).toFixed(1));
};

export const getStreakLabel = (stats: PlayerStats) => {
    if (!stats.currentStreakType || stats.currentStreakCount === 0) {
        return 'Нет серии';
    }

    return stats.currentStreakType === 'win'
        ? `${stats.currentStreakCount} побед подряд`
        : `${stats.currentStreakCount} поражени${stats.currentStreakCount === 1 ? 'е' : stats.currentStreakCount < 5 ? 'я' : 'й'} подряд`;
};
