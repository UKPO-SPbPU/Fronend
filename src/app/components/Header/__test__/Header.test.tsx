import {render, waitFor} from '@testing-library/react';
import {Header} from '../Header';
import {User} from '../../../../personalAccount/types';
import {PHONE_KEY} from '../../../../constants';

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

describe('Header component', () => {
    beforeEach(() => {
        sessionStorage.setItem(PHONE_KEY, '89257279840');
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    it('returns rendered Header component', async () => {
        const view = render(<Header />);
        await waitFor(() => {
            expect(view).not.toBe(null);
        });
    });
});
