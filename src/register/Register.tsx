import React, {memo, useState} from 'react';
import {Alert, Button, Form} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {SubmitHandler, useForm} from 'react-hook-form';

import {LeftPanelLogo} from '../app/components';
import {Routes} from '../app';
import {RegisterForm} from './types';
import {baseURL, PHONE_KEY, TOKEN_KEY} from '../constants';

import './Register.css';

export const Register = memo(function Register() {
    const navigate = useNavigate();

    const {
        register: registerFormRegister,
        handleSubmit: registerHandleSubmit,
        formState: {errors},
        unregister: unregisterRegisterForm,
        watch: registerFormWatch,
    } = useForm<RegisterForm>({shouldUnregister: true});

    const isPasswordChangeDisabled = registerFormWatch('password') !== registerFormWatch('repeatPassword');

    const [errorSubmit, setErrorSubmit] = useState(false);

    const handleSubmit: SubmitHandler<RegisterForm> = async ({fullName, phoneNumber, password}) => {
        const userRegister = {
            fullName,
            phoneNumber,
            password,
        };

        try {
            const res = await fetch(`${baseURL}/auth/register`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userRegister),
            });

            if (!res.ok) {
                const message = `An error has occured: ${res.status} - ${res.statusText}`;
                throw new Error(message);
            }

            const token = await res.text();

            // Поместить в session storage и номер теелфона для запросов
            sessionStorage.setItem(TOKEN_KEY, token);
            sessionStorage.setItem(PHONE_KEY, phoneNumber);
            navigate(Routes.PERSONAL_ACCOUNT, {replace: true});
        } catch (err) {
            setErrorSubmit(true);
        }
    };

    return (
        <div className="register-page" data-testid="registerPage">
            <LeftPanelLogo />
            <div className="register-right-panel">
                <div className="register-form-container">
                    <div className="register-form-title-container">
                        <span className="register-form-title">Добро пожаловать!</span>
                        <span className="register-form-subtitle">Зарегистрируйтесь, чтобы начать</span>
                    </div>
                    <Form className="register-form-group" onSubmit={registerHandleSubmit(handleSubmit)}>
                        <Form.Group className="mb-3" controlId="formPlaintextName">
                            <Form.Control
                                placeholder="Фамилия и Имя"
                                type="text"
                                {...registerFormRegister('fullName', {
                                    required: {value: true, message: 'Поле обязательно к заполнению'},
                                    maxLength: {
                                        value: 100,
                                        message: 'Фамилия и Имя должны содержать не более 100 символов',
                                    },
                                    pattern: {
                                        value: /^[A-Za-zА-яЁё ]*$/,
                                        message: 'Имя должно содержать алфавитные символы',
                                    },
                                })}
                                onChange={() => unregisterRegisterForm('fullName')}
                                isInvalid={!!errors.fullName?.type}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.fullName?.message || 'Ошибка ввода фамилии и имени'}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPlaintextPhone">
                            <Form.Control
                                placeholder="Номер телефона"
                                type="text"
                                {...registerFormRegister('phoneNumber')}
                                {...registerFormRegister('phoneNumber', {
                                    required: {value: true, message: 'Поле обязательно к заполнению'},
                                    maxLength: 11,
                                    pattern: {value: /[0-9]{11}/, message: 'Номер телефона состоит только из 11 цифр'},
                                })}
                                onChange={() => unregisterRegisterForm('phoneNumber')}
                                isInvalid={!!errors.phoneNumber?.type}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phoneNumber?.message || 'Ошибка ввода номера телефона'}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPlaintextPassword">
                            <Form.Control
                                placeholder="Пароль"
                                type="password"
                                {...registerFormRegister('password', {
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
                                isInvalid={!!errors.password?.type}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message || 'Пароль содержит недопустимые символы'}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPlaintextReturnPassword">
                            <Form.Control
                                placeholder="Повторный ввод пароля"
                                type="password"
                                {...registerFormRegister('repeatPassword', {
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
                                // onChange={() => unregisterRegisterForm('repeatPassword')}
                                isInvalid={!!errors.repeatPassword?.type}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.repeatPassword?.message || 'Пароль содержит недопустимые символы'}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Alert variant="danger" show={errorSubmit}>
                            Пользователь с таким номером телефона уже существует
                        </Alert>

                        <Alert variant="danger" show={isPasswordChangeDisabled}>
                            Введенные пароли не совпадают
                        </Alert>

                        <Button className="register-submit-button" type="submit" disabled={isPasswordChangeDisabled}>
                            Зарегистрироваться
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
});
