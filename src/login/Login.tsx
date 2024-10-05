import {memo, useState} from 'react';
import {Alert, Button, Form} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import {SubmitHandler, useForm} from 'react-hook-form';

import {baseURL, PHONE_KEY, TOKEN_KEY} from '../constants';
import {LoginForm} from './types';

import './Login.css';
import {Routes} from '../app/routes/Routes';
import {LeftPanelLogo} from '../app';

export const Login = memo(function Login() {
    const navigate = useNavigate();
    const {
        register: loginFormRegister,
        handleSubmit: loginHandleSubmit,
        formState: {errors},
        unregister: unregisterLoginForm,
    } = useForm<LoginForm>({shouldUnregister: true});
    const [errorSubmit, setErrorSubmit] = useState(false);

    const handleClickSubmit: SubmitHandler<LoginForm> = async (loginForm) => {
        try {
            const res = await fetch(`${baseURL}/auth/login`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginForm),
            });

            if (!res.ok) {
                const message = `An error has occured: ${res.status} - ${res.statusText}`;
                throw new Error(message);
            }

            const token = await res.text();
            sessionStorage.setItem(TOKEN_KEY, token);
            sessionStorage.setItem(PHONE_KEY, loginForm.phoneNumber);
            navigate(Routes.PERSONAL_ACCOUNT, {replace: true});
        } catch (err) {
            setErrorSubmit(true);
        }
    };

    return (
        <div className="login-page">
            <LeftPanelLogo />
            <div className="login-right-panel">
                <div className="login-form-container">
                    <div className="login-form-title-container">
                        <span className="login-form-title">И снова здравствуйте!</span>
                        <span className="login-form-subtitle">Добро пожаловать</span>
                    </div>
                    <Form className="login-form-group" onSubmit={loginHandleSubmit(handleClickSubmit)}>
                        <Form.Group className="mb-3" controlId="formPlaintextPhone">
                            <Form.Control
                                placeholder="Номер телефона"
                                type="text"
                                {...loginFormRegister('phoneNumber', {
                                    required: {value: true, message: 'Поле обязательно к заполнению'},
                                    maxLength: 11,
                                    pattern: {value: /[0-9]{11}/, message: 'Номер телефона состоит только из 11 цифр'},
                                })}
                                onChange={() => unregisterLoginForm('phoneNumber')}
                                isInvalid={!!errors.phoneNumber?.type}
                                data-testid="input-login"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phoneNumber?.message || 'Номер телефона состоит только из 11 цифр'}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPlaintextPassword">
                            <Form.Control
                                placeholder="Пароль"
                                type="password"
                                {...loginFormRegister('password', {
                                    required: {value: true, message: 'Поле обязательно к заполнению'},
                                    minLength: {value: 6, message: 'Пароль должен содержать не менее 6 символов'},
                                    pattern: {
                                        value: /^[^' ]/,
                                        message: 'Пароль не может начинаться с пробела/пробелов',
                                    },
                                    validate: {
                                        validateNumber: (value) => {
                                            return /^[a-zA-z0-9 !"#$%&'()*+\-./:;<=>?@[\]^_`{|}]*$/.test(value);
                                        },
                                    },
                                })}
                                onChange={() => unregisterLoginForm('password')}
                                isInvalid={!!errors.password?.type}
                                data-testid="input-pwd"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message || 'Пароль содержит недопустимые символы'}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Alert variant="danger" show={errorSubmit}>
                            Номер телефона или пароль введены неверно
                        </Alert>

                        <Button className="login-submit-button" type="submit" data-testid="submit-btn">
                            Войти
                        </Button>
                    </Form>

                    <Link className="login-register" to={Routes.REGISTER}>
                        Зарегистрироваться
                    </Link>
                </div>
            </div>
        </div>
    );
});
