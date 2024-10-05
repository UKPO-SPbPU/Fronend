import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {Login} from '../Login';
import {LoginForm} from '../types';

vi.mock('react-router-dom');

describe('Login page', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns rendered Login page', async () => {
        const view = render(<Login />);
        await waitFor(() => {
            expect(view).not.toBe(null);
        });
    });
});

describe('Login input forms', () => {
    beforeEach(() => {
        render(<Login />);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('return work correctly interface', () => {
        const loginForm = {
            phoneNumber: '',
            password: '',
        };
        expectTypeOf(loginForm).toMatchTypeOf<LoginForm>();
    });

    it('returns message about invalid symbols in password', async () => {
        const inputPwd = screen.getByTestId('input-pwd');
        const submitButton = screen.getByTestId('submit-btn');

        await userEvent.type(inputPwd, '~33');
        userEvent.click(submitButton);

        const invalidMessage = screen.getByText('Пароль содержит недопустимые символы');
        expect(invalidMessage).toBeInTheDocument();
    });

    it('returns message about invalid password length (length < 6)', async () => {
        const inputPwd = screen.getByTestId('input-pwd');
        const submitButton = screen.getByTestId('submit-btn');
        const password = 'pwd3';

        await userEvent.type(inputPwd, password);
        userEvent.click(submitButton);

        expect(password.length).toEqual(4);

        await waitFor(() => {
            const invalidMessage = screen.getByText('Пароль должен содержать не менее 6 символов');
            expect(invalidMessage).toBeInTheDocument();
        });
    });

    it('returns no message about invalid password length (length > 6)', async () => {
        const inputPwd = screen.getByTestId('input-pwd');
        const submitButton = screen.getByTestId('submit-btn');
        const password = '1234567';

        await userEvent.type(inputPwd, password);
        userEvent.click(submitButton);

        expect(password.length).toBeGreaterThan(6);

        await waitFor(() => {
            const invalidMessage = screen.queryByText('Пароль должен содержать не менее 6 символов');
            expect(invalidMessage).toBeNull();
        });
    });

    it('returns message about invalid length in phone number (length > 11)', async () => {
        const inputLogin = screen.getByTestId('input-login');
        const submitButton = screen.getByTestId('submit-btn');
        const phoneNumber = '893166689560';

        await userEvent.type(inputLogin, phoneNumber);
        userEvent.click(submitButton);

        expect(phoneNumber.length).toBeGreaterThan(11);

        const invalidMessage = screen.getByText('Номер телефона состоит только из 11 цифр');
        expect(invalidMessage).toBeInTheDocument();
    });

    it('returns message about invalid length in phone number (length < 11)', async () => {
        const inputLogin = screen.getByTestId('input-login');
        const submitButton = screen.getByTestId('submit-btn');
        const phoneNumber = '8931666';

        await userEvent.type(inputLogin, phoneNumber);
        userEvent.click(submitButton);

        expect(phoneNumber.length).toBeLessThan(11);
        const invalidMessage = screen.getByText('Номер телефона состоит только из 11 цифр');
        expect(invalidMessage).toBeInTheDocument();
    });

    it('returns no message about invalid length in phone number (length === 11)', async () => {
        const inputLogin = screen.getByTestId('input-login');
        const submitButton = screen.getByTestId('submit-btn');
        const phoneNumber = '89316660908';

        userEvent.type(inputLogin, phoneNumber);
        userEvent.click(submitButton);

        expect(phoneNumber.length).toEqual(11);

        expect(inputLogin.className).toEqual('form-control');
    });

    it('returns message about invalid symbols in phone number', async () => {
        const inputLogin = screen.getByTestId('input-login');
        const submitButton = screen.getByTestId('submit-btn');

        await userEvent.type(inputLogin, '8931666gpgp');
        userEvent.click(submitButton);

        const invalidMessage = screen.getByText('Номер телефона состоит только из 11 цифр');
        expect(invalidMessage).toBeInTheDocument();
    });

    it('returns message about invalid special symbols in phone number', async () => {
        const inputLogin = screen.getByTestId('input-login');
        const submitButton = screen.getByTestId('submit-btn');

        await userEvent.type(inputLogin, '+7(931)-666-80-90');
        userEvent.click(submitButton);

        const invalidMessage = screen.getByText('Номер телефона состоит только из 11 цифр');
        expect(invalidMessage).toBeInTheDocument();
    });

    it('returns message about password as required field', async () => {
        const inputPwd = screen.getByTestId('input-pwd');
        const submitButton = screen.getByTestId('submit-btn');

        await userEvent.type(inputPwd, '1234567');

        userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Поле обязательно к заполнению')).toBeInTheDocument();
        });
    });

    it('returns no message about required field', async () => {
        const inputPwd = screen.getByTestId('input-pwd');
        const inputLogin = screen.getByTestId('input-login');
        const submitButton = screen.getByTestId('submit-btn');

        const password = '1234567';
        const phoneNumber = '89316668956';

        await userEvent.type(inputLogin, phoneNumber);
        await userEvent.type(inputPwd, password);

        userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText('Поле обязательно к заполнению')).toBeNull();
        });
    });
});
