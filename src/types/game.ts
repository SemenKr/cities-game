export type GameResult = 'win' | 'loose';

export type GameOutcomeReason =
    | 'player_timeout'
    | 'computer_timeout'
    | 'computer_no_city';

export interface GameOutcome {
    result: GameResult;
    reason: GameOutcomeReason;
}
