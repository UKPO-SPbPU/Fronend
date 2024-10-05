import {render, waitFor} from '@testing-library/react';
import {Layout} from '../Layout';
import {PHONE_KEY} from '../../../../constants';
import {User} from '../../../../personalAccount/types';

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

vi.mock('@tanstack/react-query', () => ({
    useQuery: ({queryKey, queryFn}: {queryKey: string[]; queryFn: () => null}) => {
        return {data: user, isLoading: undefined, error: undefined};
    },
}));

vi.mock('react-router-dom');

describe('Layout component', () => {
    beforeEach(() => {
        sessionStorage.setItem(PHONE_KEY, '89257279840');
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    it('returns rendered Layout component', async () => {
        const view = render(<Layout />);
        await waitFor(() => {
            expect(view).not.toBe(null);
        });
    });
});
