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
const tariff2: TariffType = {
    description: 'Какой-то Тариф 2',
    id: '02',
    title: 'Тариф 2',
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
const tariff3: TariffType = {
    description: 'Какой-то Тариф 3',
    id: '03',
    title: 'Тариф 3',
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
            if (queryKey.includes('tariffs')) {
                return {data: {tariffs: [tariff1, tariff2, tariff3]}, isLoading: undefined, error: undefined};
            }
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

    it('check redirect from PersonalData.tariff to Tariffs', async () => {
        const view = render(<App url="/personalAccount/tariff" />, {wrapper: Wrapper});

        expect(view).not.toBe(null);

        await waitFor(
            () => {
                const connectButton = view.getByTestId('change') as HTMLButtonElement;

                userEvent.click(connectButton);

                expect(view.getByTestId('tariff-02')).toBeInTheDocument();
            },
            {timeout: 100, interval: 50},
        );
    });

    it('check redirect from PersonalData to Login', async () => {
        const view = render(<App url="/personalAccount" />, {wrapper: Wrapper});

        expect(view).not.toBe(null);

        await waitFor(() => {
            const logoutButton = view.getByTestId('logout') as HTMLButtonElement;
            userEvent.click(logoutButton);

            const submitLogoutButton = view.getByTestId('submit_logout') as HTMLButtonElement;
            userEvent.click(submitLogoutButton);

            expect(view.getByText('Добро пожаловать')).toBeInTheDocument();
        });
    });

    it('check redirect from PersonalData to Reports', async () => {
        const view = render(<App url="/personalAccount" />, {wrapper: Wrapper});

        expect(view).not.toBe(null);

        await waitFor(() => {
            const reportsButton = view.getByTestId('reports');
            userEvent.click(reportsButton);

            expect(view.getByText('Отчет')).toBeInTheDocument();
            expect(view.getByText('Сгенерировать')).toBeInTheDocument();
        });
    });

    it('check redirect from Login to Register', async () => {
        const view = render(<App url="/login" />, {wrapper: Wrapper});

        expect(view).not.toBe(null);

        await waitFor(() => {
            const registerButton = view.getByText('Зарегистрироваться');
            userEvent.click(registerButton);

            expect(view.getByText('Зарегистрируйтесь, чтобы начать')).toBeInTheDocument();
        });
    });

    it('check protecting router from unathorized user', async () => {
        sessionStorage.removeItem(TOKEN_KEY);
        const view = render(<App url="/personalAccount" />, {wrapper: Wrapper});
        expect(view.getByText('Добро пожаловать')).toBeInTheDocument();
    });
});
