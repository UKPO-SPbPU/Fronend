import {render, screen, waitFor} from '@testing-library/react';
import {Tariff} from '../Tariff';
import {Tariff as TariffType} from '../../../tariffs/types';
import {User} from '../../types';
import {PHONE_KEY, TOKEN_KEY} from '../../../constants';

const user: User = {
    fio: 'Иванов Иван Иванович',
    phoneNumber: '89317011737',
    numberPersonalAccount: 1,
    contractDate: '09092022',
    region: 'Карелия',
    passport: '1029191717',
    birthDate: '01121982',
    email: 'ivan.82@mail.ru',
};

const tariff: TariffType = {
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

const tariffEmpty: TariffType = {
    description: '',
    id: null as never as string,
    title: '',
    telephonyPackage: {
        incomingCall: false,
        packOfMinutes: 0,
        packCost: 0,
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

vi.mock('react-router-dom');
vi.mock('@tanstack/react-query', () => ({
    useQuery: ({queryKey, queryFn}: {queryKey: string[]; queryFn: () => null}) => {
        if (queryKey.includes('tariff')) {
            return {data: {tariff: tariff}, isLoading: undefined, error: undefined};
        }
        if (queryKey.includes('user')) {
            return {data: user, isLoading: undefined, error: undefined};
        }
    },
}));

describe('Tariff page', () => {
    beforeEach(() => {
        render(<Tariff />);
        sessionStorage.setItem(PHONE_KEY, '89257279840');
        sessionStorage.setItem(TOKEN_KEY, '000-top-secret-token-000');
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    it('returns rendered Tariff page', async () => {
        await waitFor(() => {
            expect(screen).not.toBe(null);
        });
    });

    it('returns error if user has no tariff', async () => {
        tariff.id = null as never as string;
        vi.mock('@tanstack/react-query', () => ({
            useQuery: ({queryKey, queryFn}: {queryKey: string[]; queryFn: () => null}) => {
                if (queryKey.includes('tariff')) {
                    return {data: {tariff: tariffEmpty}, isLoading: undefined, error: undefined};
                }
                if (queryKey.includes('user')) {
                    return {data: user, isLoading: undefined, error: undefined};
                }
            },
        }));

        const invalidMessage = screen.getByText('Тариф не подключен');
        await waitFor(() => {
            expect(invalidMessage).toBeInTheDocument();
        });
    });
});
