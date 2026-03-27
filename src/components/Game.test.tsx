import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Game } from './Game.tsx';

vi.mock('src/data/CitiesListData.ts', () => ({
    default: ['Самара', 'Армавир', 'Астрахань', 'Анапа', 'Норильск', 'Рязань', 'Кемерово'],
}));

const flushLazyScreen = async () => {
    await act(async () => {
        await vi.dynamicImportSettled();
    });
};

const waitForStartScreen = async () => {
    await flushLazyScreen();
    return screen.getByRole('button', { name: 'Начать игру' });
};

const clickSegmentOption = async (label: string) => {
    await flushLazyScreen();
    fireEvent.click(screen.getByTitle(label));
};

describe('Game flows', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.useFakeTimers();
        vi.spyOn(Math, 'random').mockReturnValue(0);
    });

    afterEach(() => {
        cleanup();
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it.each([
        { difficulty: 'Легко', expectedCity: 'Анапа' },
        { difficulty: 'Нормально', expectedCity: 'Астрахань' },
        { difficulty: 'Сложно', expectedCity: 'Армавир' },
    ])('uses $difficulty difficulty to choose $expectedCity', async ({ difficulty, expectedCity }) => {
        render(<Game />);

        await waitForStartScreen();
        await clickSegmentOption(difficulty);
        fireEvent.click(screen.getByRole('button', { name: 'Начать игру' }));
        await flushLazyScreen();

        const input = screen.getByPlaceholderText('Введите любой город');
        fireEvent.change(input, { target: { value: 'Самара' } });
        fireEvent.submit(input.closest('form') as HTMLFormElement);

        act(() => {
            vi.advanceTimersByTime(3000);
        });
        await flushLazyScreen();

        expect(screen.getByText(expectedCity)).toBeInTheDocument();
    });

    it('shows a loss when the player timer reaches zero', async () => {
        render(<Game />);

        await waitForStartScreen();
        await clickSegmentOption('1 мин');
        fireEvent.click(screen.getByRole('button', { name: 'Начать игру' }));

        act(() => {
            vi.advanceTimersByTime(60000);
        });
        await flushLazyScreen();

        expect(screen.getByText('Ваш таймер дошел до нуля')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Поражение' })).toBeInTheDocument();
    });

    it('shows a win when the computer has no city and updates start screen stats after restart', async () => {
        render(<Game />);

        await waitForStartScreen();
        fireEvent.click(screen.getByRole('button', { name: 'Начать игру' }));
        await flushLazyScreen();

        const input = screen.getByPlaceholderText('Введите любой город');
        fireEvent.change(input, { target: { value: 'Кемерово' } });
        fireEvent.submit(input.closest('form') as HTMLFormElement);

        act(() => {
            vi.advanceTimersByTime(3000);
        });
        await flushLazyScreen();

        expect(screen.getByText('У компьютера не осталось подходящих городов')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Победа' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Начать новую игру' }));
        await flushLazyScreen();

        const gamesStatCard = screen.getByText('Сыграно').parentElement?.parentElement;
        const streakStatCard = screen.getByText('Серия').parentElement?.parentElement;

        expect(gamesStatCard).toHaveTextContent('1');
        expect(streakStatCard).toHaveTextContent('1 побед подряд');
    });
});
