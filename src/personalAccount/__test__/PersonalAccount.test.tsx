import {render, waitFor} from '@testing-library/react';
import {PersonalAccount} from '../PersonalAccount';
import {User} from '../types';
import {Tariff} from '../../tariffs/types';

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

vi.mock('react-router-dom');
vi.mock('@tanstack/react-query', () => ({
    useQuery: ({queryKey, queryFn}: {queryKey: string[]; queryFn: () => null}) => {
        if (queryKey.includes('tariff')) {
            return {data: {tariff: tariff1}, isLoading: undefined, error: undefined};
        }
        if (queryKey.includes('user')) {
            return {data: user, isLoading: undefined, error: undefined};
        }
    },
}));

describe('PersonalAccount page', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns rendered PersonalAccount page', async () => {
        const view = render(<PersonalAccount />);
        await waitFor(() => {
            expect(view).not.toBe(null);
        });
    });
});
