import { describe, expect, it } from 'vitest';
import {
    createInitialPlayerStats,
    getAverageCitiesPerRound,
    getRoundStats,
    getStreakLabel,
    updatePlayerStats,
} from './gameStats.ts';

describe('gameStats', () => {
    it('builds round stats from used cities', () => {
        expect(getRoundStats(['Москва', 'Архангельск', 'Казань'])).toEqual({
            totalCities: 3,
            playerCities: 2,
            computerCities: 1,
            lastCity: 'Казань',
        });
    });

    it('updates aggregate stats and streak after a win', () => {
        const stats = updatePlayerStats({
            previousStats: createInitialPlayerStats(),
            result: 'win',
            usedCitiesInGame: ['Москва', 'Архангельск', 'Казань'],
        });

        expect(stats).toEqual({
            totalGames: 1,
            wins: 1,
            losses: 0,
            bestRoundCities: 3,
            totalCitiesPlayed: 3,
            currentStreakType: 'win',
            currentStreakCount: 1,
        });
    });

    it('resets streak type and calculates averages', () => {
        const firstRound = updatePlayerStats({
            previousStats: createInitialPlayerStats(),
            result: 'win',
            usedCitiesInGame: ['Москва', 'Архангельск', 'Казань', 'Норильск'],
        });
        const secondRound = updatePlayerStats({
            previousStats: firstRound,
            result: 'loose',
            usedCitiesInGame: ['Омск', 'Курск'],
        });

        expect(getAverageCitiesPerRound(secondRound)).toBe(3);
        expect(getStreakLabel(secondRound)).toBe('1 поражение подряд');
    });
});
