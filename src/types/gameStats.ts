import { GameResult } from "src/types/game.ts";

export interface PlayerStats {
    totalGames: number;
    wins: number;
    losses: number;
    bestRoundCities: number;
    totalCitiesPlayed: number;
    currentStreakType: GameResult | null;
    currentStreakCount: number;
}

export interface RoundStats {
    totalCities: number;
    playerCities: number;
    computerCities: number;
    lastCity: string | null;
}
