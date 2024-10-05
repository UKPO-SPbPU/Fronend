import {describe, it, vi, afterEach, beforeEach} from 'vitest';
import {prettyDOM, render, waitFor} from '@testing-library/react';
import {Tariff as TariffType} from '../tariffs/types';
import userEvent from '@testing-library/user-event';
import {PHONE_KEY, TOKEN_KEY} from '../constants';
import {User} from '../personalAccount/types';
import {ReactNode, memo} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';
import {useRoutes} from '../app/routes';
import nodeFetch, {Request, Response} from 'node-fetch';

Object.assign(global, {fetch: nodeFetch, Request, Response});

const tariff1: TariffType = {
    description: 'Тест тариф 1',
    id: '01',
    title: 'Тариф 1',
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

const client = new QueryClient();

const Wrapper = memo(function App({children}: {children: ReactNode}) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
});

const App = memo(function App({url}: {url: string}) {
    const router = createMemoryRouter(useRoutes(), {
        initialEntries: [url],
    });

    return <RouterProvider router={router} />;
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
    const mod = await importOriginal<typeof import('@tanstack/react-query')>();
    return {
        ...mod,

        useQuery: ({queryKey, queryFn}: {queryKey: string[]; queryFn: () => null}) => {
            if (queryKey.includes('tariffInfo')) {
                return {data: {tariff: tariff1}, isLoading: undefined, error: undefined};
            }
            if (queryKey.includes('tariff')) {
                return {data: {tariff: tariff1}, isLoading: undefined, error: undefined};
            }
            if (queryKey.includes('user')) {
                return {data: user, isLoading: undefined, error: undefined};
            }
        },
    };
});

describe('routes', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
        sessionStorage.setItem(PHONE_KEY, '89257279840');
        sessionStorage.setItem(TOKEN_KEY, '000-top-secret-token-000');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('check redirect from PersonalData to Personal tariff', async () => {
        const view = render(<App url="/personalAccount/personalData" />, {wrapper: Wrapper});

        const personalTab = view.getAllByRole('tab')[0];
        expect(personalTab.getAttribute('aria-selected')).toBeTruthy();

        const tariffTab = view.getAllByRole('tab')[1];
        expect(tariffTab.getAttribute('aria-selected')).toBe('false');

        await waitFor(() => {
            userEvent.click(tariffTab);

            expect(personalTab.getAttribute('aria-selected')).toBe('false');
            expect(tariffTab.getAttribute('aria-selected')).toBeTruthy();
        });
    });

    it('check opened modal window on change passport data', async () => {
        const view = render(<App url="/personalAccount/personalData" />, {wrapper: Wrapper});
        const inputPassport = view.getByTestId('input-passport');

        userEvent.clear(inputPassport);
        userEvent.type(inputPassport, '1234567890');

        const submitButton = view.getByTestId('submit-passport');
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(view.getByText('Вы уверены, что хотите сохранить изменения?')).toBeInTheDocument();
        });
    });
});
