import { describe, expect, it } from 'vitest';
import {
    chooseComputerCity,
    filterAvailableCities,
    findCanonicalCity,
    getLastLetter,
    hasCityBeenUsed,
    matchesRequiredLetter,
    normalizeCity,
} from './cityRules.ts';

const cities = [
    'Москва',
    'Архангельск',
    'Йошкар-Ола',
    'Тверь',
    'Омск',
    'Ессентуки',
];

describe('cityRules', () => {
    it('normalizes case, extra spaces and е/ё', () => {
        expect(normalizeCity('  ЁШКАР-ОЛА  ')).toBe('ешкар-ола');
        expect(normalizeCity('Нижний   Новгород')).toBe('нижний новгород');
    });

    it('finds canonical city by normalized input', () => {
        expect(findCanonicalCity('  москва ', cities)).toBe('Москва');
        expect(findCanonicalCity('йошкар-ола', cities)).toBe('Йошкар-Ола');
        expect(findCanonicalCity('Несуществующий', cities)).toBeNull();
    });

    it('calculates last playable letter', () => {
        expect(getLastLetter('Тверь')).toBe('Р');
        expect(getLastLetter('Йошкар-Ола')).toBe('А');
        expect(getLastLetter('')).toBe('');
    });

    it('checks required starting letter using normalized input', () => {
        expect(matchesRequiredLetter(' архангельск', 'А')).toBe(true);
        expect(matchesRequiredLetter('ёссентуки', 'Е')).toBe(true);
        expect(matchesRequiredLetter('Москва', 'А')).toBe(false);
    });

    it('detects reused cities regardless of case and е/ё', () => {
        expect(hasCityBeenUsed('москва', ['Москва'])).toBe(true);
        expect(hasCityBeenUsed('ёссентуки', ['Ессентуки'])).toBe(true);
        expect(hasCityBeenUsed('Омск', ['Москва'])).toBe(false);
    });

    it('filters available cities by letter, query and used list', () => {
        expect(
            filterAvailableCities({
                cities,
                requiredLetter: 'О',
                usedCities: ['Омск'],
            }),
        ).toEqual([]);

        expect(
            filterAvailableCities({
                cities,
                requiredLetter: 'Е',
                usedCities: [],
                query: 'ссен',
            }),
        ).toEqual(['Ессентуки']);

        expect(
            filterAvailableCities({
                cities,
                requiredLetter: '',
                usedCities: ['Москва'],
                query: 'кар',
            }),
        ).toEqual(['Йошкар-Ола']);
    });

    it('chooses a computer move that leaves the player fewer replies', () => {
        expect(
            chooseComputerCity({
                cities: ['Армавир', 'Анапа', 'Астрахань', 'Норильск'],
                requiredLetter: 'А',
                usedCities: [],
                difficulty: 'hard',
            }),
        ).toBe('Армавир');
    });

    it('chooses a balanced move on medium difficulty', () => {
        expect(
            chooseComputerCity({
                cities: ['Армавир', 'Анапа', 'Астрахань', 'Норильск'],
                requiredLetter: 'А',
                usedCities: [],
                difficulty: 'medium',
            }),
        ).toBe('Астрахань');
    });

    it('chooses the easiest reply for the player on easy difficulty', () => {
        expect(
            chooseComputerCity({
                cities: ['Армавир', 'Анапа', 'Астрахань', 'Норильск'],
                requiredLetter: 'А',
                usedCities: [],
                difficulty: 'easy',
            }),
        ).toBe('Анапа');
    });

    it('returns null when the computer has no valid move', () => {
        expect(
            chooseComputerCity({
                cities,
                requiredLetter: 'Ю',
                usedCities: [],
            }),
        ).toBeNull();
    });
});
