import {render, waitFor} from '@testing-library/react';
import {UserData} from '../UserData';
import {User} from '../../../../types';

const user: User = {
    fio: 'Иванов Иван Иванович',
    phoneNumber: '89317011737',
    numberPersonalAccount: 1,
    contractDate: '09.09.2022',
    region: 'Карелия',
    passport: '1029191717',
    birthDate: '01.12.1982',
    email: 'ivan.82@mail.ru',
};

describe('UserData component', () => {
    it('returns rendered UserData component', async () => {
        const view = render(<UserData user={user} />);
        await waitFor(() => {
            expect(view).not.toBe(null);
        });
    });
});
