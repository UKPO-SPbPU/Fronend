import {describe, expect, it, vi, afterEach, beforeEach} from 'vitest';
import {getNearestWithdrawal} from '../tariffDate';

describe('personalAccount', () => {
    describe('tariff', () => {
        describe('logic', () => {
            describe('getNearestWithdrawal', () => {
                beforeEach(() => {
                    vi.useFakeTimers();
                });

                afterEach(() => {
                    vi.useRealTimers();
                });

                it('return nearest withdraw for contract date with month December', () => {
                    const date = new Date(2024, 11, 1, 0);
                    vi.setSystemTime(date);
                    expect(getNearestWithdrawal('05.02.2013')).toBe('05.01.2025');
                });

                it('return nearest withdraw for contract date with month september', () => {
                    const date = new Date(2024, 9, 1, 0);
                    vi.setSystemTime(date);
                    expect(getNearestWithdrawal('05.02.2013')).toBe('05.11.2024');

                    const date2 = new Date(2024, 7, 1, 0);
                    vi.setSystemTime(date2);
                    expect(getNearestWithdrawal('05.02.2013')).toBe('05.09.2024');
                });
            });
        });
    });
});
