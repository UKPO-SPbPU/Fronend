import {render, screen, waitFor} from '@testing-library/react';
import {User} from '../../../../types';
import {UserForm} from '../UserForm';
import userEvent from '@testing-library/user-event';

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

describe('UserForm component', () => {
    it('returns rendered UserForm component', async () => {
        const view = render(<UserForm user={user} />);
        await waitFor(() => {
            expect(view).not.toBe(null);
        });
    });
});

describe('UserForm input forms', () => {
    beforeEach(() => {
        render(<UserForm user={user} />);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns message about invalid passport length (length < 10)', async () => {
        const inputPassport = screen.getByTestId('input-passport');
        const passport = '1029191';

        userEvent.type(inputPassport, passport);

        expect(passport.length).toBeLessThan(10);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-passport');
            userEvent.click(submitButton);

            const invalidMessage = screen.getByText('Паспорт состоит только из 10 цифр');
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it('returns message about invalid passport length (length > 10)', async () => {
        const inputPassport = screen.getByTestId('input-passport');
        const passport = '10291917107';

        await userEvent.type(inputPassport, passport);

        expect(passport.length).toBeGreaterThan(10);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-passport');
            userEvent.click(submitButton);

            const invalidMessage = screen.getByText('Паспорт состоит только из 10 цифр');
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it.each([
        {passport: '123456789', expect: 'form-control is-invalid'},
        {passport: '1234567890', expect: 'form-control'},
        {passport: '12345678901', expect: 'form-control is-invalid'},
    ])('returns %s passport input', async ({passport, expect: _expect}) => {
        const inputPassport = screen.getByTestId('input-passport');

        await userEvent.type(inputPassport, passport);

        const submitButton = screen.getByTestId('submit-passport');
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(inputPassport.className).toEqual(_expect);
        });
    });

    it('returns message about invalid email', async () => {
        const inputEmail = screen.getByTestId('input-email');
        const email = 'ivan@mail';

        await userEvent.type(inputEmail, email);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-email');
            userEvent.click(submitButton);

            const invalidMessage = screen.getByText('Email введен некорректно');
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it('returns message about invalid new password length (length < 6)', async () => {
        const changePwdButton = screen.getByTestId('change-pwd');
        userEvent.click(changePwdButton);

        const inputOldPassword = screen.getByTestId('input-old-pwd');
        const inputNewPassword = screen.getByTestId('input-new-pwd');
        const inputReNewPassword = screen.getByTestId('input-re-new-pwd');
        const oldPassword = '1234567';
        const newPassword = '1234';

        await userEvent.type(inputOldPassword, oldPassword);
        await userEvent.type(inputNewPassword, newPassword);
        await userEvent.type(inputReNewPassword, newPassword);

        expect(newPassword.length).toBeLessThan(6);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-pwd');
            userEvent.click(submitButton);

            const invalidMessage = screen.getAllByText('Пароль должен содержать не менее 6 символов')[1];
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it('returns message about invalid new password length (length < 6)', async () => {
        const changePwdButton = screen.getByTestId('change-pwd');
        userEvent.click(changePwdButton);

        const inputOldPassword = screen.getByTestId('input-old-pwd');
        const inputNewPassword = screen.getByTestId('input-new-pwd');
        const inputReNewPassword = screen.getByTestId('input-re-new-pwd');
        const oldPassword = '123';
        const newPassword = '1234567';

        await userEvent.type(inputOldPassword, oldPassword);
        await userEvent.type(inputNewPassword, newPassword);
        await userEvent.type(inputReNewPassword, newPassword);

        expect(oldPassword.length).toBeLessThan(6);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-pwd');
            userEvent.click(submitButton);

            const invalidMessage = screen.getAllByText('Пароль должен содержать не менее 6 символов')[0];
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it('returns message about old password as required field', async () => {
        const changePwdButton = screen.getByTestId('change-pwd');
        userEvent.click(changePwdButton);

        const inputNewPassword = screen.getByTestId('input-new-pwd');
        const inputReNewPassword = screen.getByTestId('input-re-new-pwd');
        const newPassword = '1234567';

        await userEvent.type(inputNewPassword, newPassword);
        await userEvent.type(inputReNewPassword, newPassword);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-pwd');
            userEvent.click(submitButton);

            const invalidMessage = screen.getByText('Поле обязательно к заполнению');
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it('returns message about new password not equal re-new password', async () => {
        const changePwdButton = screen.getByTestId('change-pwd');
        userEvent.click(changePwdButton);

        const inputOldPassword = screen.getByTestId('input-old-pwd');
        const inputNewPassword = screen.getByTestId('input-new-pwd');
        const inputReNewPassword = screen.getByTestId('input-re-new-pwd');
        const oldPassword = '123456789';
        const newPassword = '1234567';
        const reNewPassword = '12345678';

        await userEvent.type(inputOldPassword, oldPassword);
        await userEvent.type(inputNewPassword, newPassword);
        await userEvent.type(inputReNewPassword, reNewPassword);

        expect(newPassword).not.toEqual(reNewPassword);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-pwd');
            userEvent.click(submitButton);

            const invalidMessage = screen.getByText(
                'Пароль не совпадает с введенным выше паролем или имеет не допустимые символы',
            );
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it('returns message about invalid symbols in old password', async () => {
        const changePwdButton = screen.getByTestId('change-pwd');
        userEvent.click(changePwdButton);

        const inputOldPassword = screen.getByTestId('input-old-pwd');
        const inputNewPassword = screen.getByTestId('input-new-pwd');
        const inputReNewPassword = screen.getByTestId('input-re-new-pwd');
        const oldPassword = '~1234~';
        const newPassword = '1234567';

        await userEvent.type(inputOldPassword, oldPassword);
        await userEvent.type(inputNewPassword, newPassword);
        await userEvent.type(inputReNewPassword, newPassword);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-pwd');
            userEvent.click(submitButton);

            const invalidMessage = screen.getByText('Пароль содержит недопустимые символы');
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it('returns message about invalid symbols in new password', async () => {
        const changePwdButton = screen.getByTestId('change-pwd');
        userEvent.click(changePwdButton);

        const inputOldPassword = screen.getByTestId('input-old-pwd');
        const inputNewPassword = screen.getByTestId('input-new-pwd');
        const inputReNewPassword = screen.getByTestId('input-re-new-pwd');
        const oldPassword = '12345678';
        const newPassword = '~~1234567';
        const reNewPassword = '12345678';

        await userEvent.type(inputOldPassword, oldPassword);
        await userEvent.type(inputNewPassword, newPassword);
        await userEvent.type(inputReNewPassword, reNewPassword);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-pwd');
            userEvent.click(submitButton);

            const invalidMessage = screen.getByText('Пароль содержит недопустимые символы');
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it('returns message about invalid symbols in re-new password', async () => {
        const changePwdButton = screen.getByTestId('change-pwd');
        userEvent.click(changePwdButton);

        const inputOldPassword = screen.getByTestId('input-old-pwd');
        const inputNewPassword = screen.getByTestId('input-new-pwd');
        const inputReNewPassword = screen.getByTestId('input-re-new-pwd');
        const oldPassword = '12345678';
        const newPassword = '1234567';
        const reNewPassword = '~12345678';

        await userEvent.type(inputOldPassword, oldPassword);
        await userEvent.type(inputNewPassword, newPassword);
        await userEvent.type(inputReNewPassword, reNewPassword);

        await waitFor(() => {
            const submitButton = screen.getByTestId('submit-pwd');
            userEvent.click(submitButton);

            const invalidMessage = screen.getByText('Пароль содержит недопустимые символы');
            expect(invalidMessage).toBeInTheDocument();
        });
    });
});
