import {describe, it, vi, afterEach, beforeEach} from 'vitest';
import {render} from '@testing-library/react';
import {Tariffs} from '../Tariffs';
import {Tariff} from '../types';

const tariff1: Tariff = {
    description: 'Тест тариф',
    id: '01',
    title: 'Тест тариф',
    telephonyPackage: {
        incomingCall: false,
        packOfMinutes: 5,
        packCost: 5,
        packCostPerMinute: false,
        extraPackCost: 10,
        extraPackCostPerMinute: false,
    },
    internetPackage: {
        packOfMB: 5,
        packCost: 7,
        packCostPerMB: false,
        extraPackCost: 10,
        extraPackCostPerMB: false,
    },
};
const tariff2: Tariff = {
    description: 'Какой-то Тариф',
    id: '01',
    title: 'Тариф',
    telephonyPackage: {
        incomingCall: false,
        packOfMinutes: 5,
        packCost: 5,
        packCostPerMinute: false,
        extraPackCost: 10,
        extraPackCostPerMinute: false,
    },
    internetPackage: {
        packOfMB: 5,
        packCost: 7,
        packCostPerMB: false,
        extraPackCost: 10,
        extraPackCostPerMB: false,
    },
};

vi.mock('@tanstack/react-query', () => ({
    useQuery: ({queryKey, queryFn}: {queryKey: string[]; queryFn: () => null}) => {
        if (queryKey.includes('tariffs')) {
            return {data: {tariffs: [tariff1, tariff2]}, isLoading: undefined, error: undefined};
        }
        if (queryKey.includes('tariffInfo')) {
            return {data: {tariff: tariff1}, isLoading: undefined, error: undefined};
        }
    },
}));

describe('Tariffs', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('return render Tariffs page', () => {
        const view = render(<Tariffs />);
        expect(view).not.toBe(null);
    });
});
