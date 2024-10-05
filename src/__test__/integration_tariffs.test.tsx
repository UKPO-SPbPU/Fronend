import {describe, it, vi, afterEach, beforeEach} from 'vitest';
import {prettyDOM, render, waitFor} from '@testing-library/react';
import {Tariff} from '../tariffs/types';
import {Tariffs} from '../tariffs/Tariffs';
import userEvent from '@testing-library/user-event';

const tariff1: Tariff = {
    description: 'Тест тариф 1',
    id: '01',
    title: 'Общительный',
    telephonyPackage: {
        incomingCall: false,
        packOfMinutes: 50,
        packCost: 80,
        packCostPerMinute: false,
        extraPackCost: 0,
        extraPackCostPerMinute: false,
    },
    internetPackage: {
        packOfMB: 0,
        packCost: 0,
        packCostPerMB: false,
        extraPackCost: 0,
        extraPackCostPerMB: false,
    },
};
const tariff2: Tariff = {
    description: 'Какой-то Тариф 2',
    id: '02',
    title: 'Мега-общительный',
    telephonyPackage: {
        incomingCall: false,
        packOfMinutes: 10,
        packCost: 40,
        packCostPerMinute: false,
        extraPackCost: 10,
        extraPackCostPerMinute: false,
    },
    internetPackage: {
        packOfMB: 0,
        packCost: 0,
        packCostPerMB: false,
        extraPackCost: 0,
        extraPackCostPerMB: false,
    },
};
const tariff3: Tariff = {
    description: 'Какой-то Тариф 3',
    id: '03',
    title: 'Премиум',
    telephonyPackage: {
        incomingCall: false,
        packOfMinutes: 10,
        packCost: 60,
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
            return {data: {tariffs: [tariff1, tariff2, tariff3]}, isLoading: undefined, error: undefined};
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

    it('check select tariffs', async () => {
        const view = render(<Tariffs />);

        expect(view).not.toBe(null);
        expect((view.getByTestId('tariff-01') as HTMLButtonElement).disabled).toBeTruthy();

        await waitFor(() => {
            const selectSecondTariffButton = view.getByTestId('tariff-02') as HTMLButtonElement;
            userEvent.click(selectSecondTariffButton);

            const submitButton = view.getByTestId('submit-modal');
            userEvent.click(submitButton);

            const selectFirstTariffButton = view.getByTestId('tariff-01') as HTMLButtonElement;
            expect(selectFirstTariffButton.disabled).toBeFalsy();
            expect(selectSecondTariffButton.disabled).toBeTruthy();
        });
    });

    it('check search tariffs', async () => {
        const view = render(<Tariffs />);

        expect(view.getByText('Общительный')).toBeInTheDocument();
        expect(view.getByText('Мега-общительный')).toBeInTheDocument();
        expect(view.queryByText('Премиум')).toBeInTheDocument();

        const searchInput = view.getByTestId('search') as HTMLInputElement;
        userEvent.type(searchInput, 'общительный');

        await waitFor(() => {
            expect(view.getByText('Общительный')).toBeInTheDocument();
            expect(view.getByText('Мега-общительный')).toBeInTheDocument();
        });

        expect(view.queryByText('Премиум')).toBeNull();
    });

    it('check filters tariffs', async () => {
        const view = render(<Tariffs />);

        expect(view.getByText('Общительный')).toBeInTheDocument();
        expect(view.getByText('Мега-общительный')).toBeInTheDocument();
        expect(view.getByText('Премиум')).toBeInTheDocument();

        await waitFor(() => {
            const filterButton = view.getByTestId('filter') as HTMLButtonElement;
            userEvent.click(filterButton);

            const minInput = view.getByTestId('cost_min') as HTMLInputElement;
            userEvent.type(minInput, '550');

            const maxInput = view.getByTestId('cost_min') as HTMLInputElement;
            userEvent.type(maxInput, '750');

            const submitButton = view.getByTestId('filters_submit') as HTMLButtonElement;
            userEvent.click(submitButton);

            expect(view.getByText('Мега-общительный')).toBeInTheDocument();
        });

        expect(view.queryByText('Общительный')).toBeNull();
        expect(view.queryByText('Премиум')).toBeNull();
    });
});
