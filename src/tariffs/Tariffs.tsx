import React, {memo, useCallback, useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {RotateLoader} from 'react-spinners';
import {Alert, Button, Col, Form, InputGroup, Modal, Row} from 'react-bootstrap';
import {SubmitHandler, useForm} from 'react-hook-form';

import {TariffsSlider} from './components';
import {FiltersTariffs, Tariff, Tariffs as TariffsI} from './types';
import {filterTariffs} from './logic/filterTariffs';

import './Tariffs.css';
import {baseURL, PHONE_KEY, TOKEN_KEY} from '../constants';

export const Tariffs = memo(function Tariffs() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const phoneNumber = sessionStorage.getItem(PHONE_KEY)!;
    const {
        data: resTariffs,
        isLoading,
        error,
    } = useQuery<TariffsI>({
        queryKey: ['tariffs'],
        queryFn: () =>
            fetch(`${baseURL}/tariffs`, {
                method: 'get',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json()),
    });

    const {data: tariffInfoRes, isLoading: isLoadingTariffInfo} = useQuery<{tariff: Tariff}>({
        queryKey: ['tariffInfo'],
        queryFn: () =>
            fetch(`${baseURL}/tariff/${phoneNumber}`, {
                method: 'get',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json()),
    });

    const {
        register: filtersTariffRegister,
        handleSubmit: filtersTariffHandleSubmit,
        formState: {errors},
        unregister: unregisterFiltersTariffs,
    } = useForm<FiltersTariffs>();

    const [search, setSearch] = useState<string>();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FiltersTariffs>();

    const filteredTariffs = useMemo(
        () => filterTariffs(resTariffs?.tariffs, {search: search, filters: filters}),
        [filters, resTariffs?.tariffs, search],
    );

    const handleChangeInput = useCallback(
        (e: any) => {
            setSearch(e.target.value);
        },
        [setSearch],
    );

    const handleOpen = useCallback(() => {
        setShowFilters(true);
    }, []);

    const handleClose = useCallback(() => {
        setShowFilters(false);
    }, []);

    const handleSubmit: SubmitHandler<FiltersTariffs> = useCallback((filtersTariff) => {
        setFilters(filtersTariff);
        setShowFilters(false);
    }, []);

    if (isLoading || isLoadingTariffInfo) {
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '75%'}}>
                <RotateLoader className="text-center m-auto" color="#5c31f1" size={35} margin={40} />
            </div>
        );
    }

    if (error) {
        return <Alert className="center">Ошибка сервера</Alert>;
    }

    return (
        <div className="tariffs-page">
            <div className="tariffs-search-container">
                <input
                    type="search"
                    value={search || ''}
                    onChange={handleChangeInput}
                    className="form-control tariffs-search-input"
                    placeholder="Поиск по названию"
                    aria-label="Поиск по названию"
                    data-testid="search"
                />
                <Button className="tariffs-button" onClick={handleOpen} data-testid="filter">
                    Фильтр
                </Button>

                <Modal show={showFilters} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Фильтры</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={filtersTariffHandleSubmit(handleSubmit)}>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5">
                                    Стоимость тарифа
                                </Form.Label>
                                <Col sm="3">
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text>от</InputGroup.Text>
                                        <Form.Control
                                            placeholder="0"
                                            {...filtersTariffRegister('costTariff.min', {
                                                validate: {
                                                    positive: (v) => Number(v) >= 0,
                                                },
                                            })}
                                            onChange={() => unregisterFiltersTariffs('costTariff.min')}
                                            isInvalid={!!errors.costTariff?.min?.type}
                                            data-testid="cost_min"
                                        />
                                        <Form.Control.Feedback type="invalid">Число больше нуля</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                                <Col sm="3">
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text>до</InputGroup.Text>
                                        <Form.Control
                                            placeholder="0"
                                            {...filtersTariffRegister('costTariff.max', {
                                                validate: {
                                                    positive: (v) => Number(v) >= 0,
                                                },
                                            })}
                                            onChange={() => unregisterFiltersTariffs('costTariff.max')}
                                            isInvalid={!!errors.costTariff?.max?.type}
                                            data-testid="cost_max"
                                        />
                                        <Form.Control.Feedback type="invalid">Число больше нуля</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5">
                                    Кол-во МИН звонков
                                </Form.Label>
                                <Col sm="3">
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text>от</InputGroup.Text>
                                        <Form.Control
                                            placeholder="0"
                                            {...filtersTariffRegister('minutesTariff.min', {
                                                validate: {
                                                    positive: (v) => Number(v) >= 0,
                                                },
                                            })}
                                            onChange={() => unregisterFiltersTariffs('minutesTariff.min')}
                                            isInvalid={!!errors.minutesTariff?.min?.type}
                                        />
                                        <Form.Control.Feedback type="invalid">Число больше нуля</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                                <Col sm="3">
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text>до</InputGroup.Text>
                                        <Form.Control
                                            placeholder="0"
                                            {...filtersTariffRegister('minutesTariff.max', {
                                                validate: {
                                                    positive: (v) => Number(v) >= 0,
                                                },
                                            })}
                                            onChange={() => unregisterFiltersTariffs('minutesTariff.max')}
                                            isInvalid={!!errors.minutesTariff?.max?.type}
                                        />
                                        <Form.Control.Feedback type="invalid">Число больше нуля</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5">
                                    Кол-во ГБ интернета
                                </Form.Label>
                                <Col sm="3">
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text>от</InputGroup.Text>
                                        <Form.Control
                                            placeholder="0"
                                            {...filtersTariffRegister('internetTariff.min', {
                                                validate: {
                                                    positive: (v) => Number(v) >= 0,
                                                },
                                            })}
                                            onChange={() => unregisterFiltersTariffs('internetTariff.min')}
                                            isInvalid={!!errors.internetTariff?.min?.type}
                                        />
                                        <Form.Control.Feedback type="invalid">Число больше нуля</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                                <Col sm="3">
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text>до</InputGroup.Text>
                                        <Form.Control
                                            placeholder="0"
                                            {...filtersTariffRegister('internetTariff.max', {
                                                validate: {
                                                    positive: (v) => Number(v) >= 0,
                                                },
                                            })}
                                            onChange={() => unregisterFiltersTariffs('internetTariff.max')}
                                            isInvalid={!!errors.internetTariff?.max?.type}
                                        />
                                        <Form.Control.Feedback type="invalid">Число больше нуля</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5">
                                    Кол-во ШТ сообщений
                                </Form.Label>
                                <Col sm="3">
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text>от</InputGroup.Text>
                                        <Form.Control
                                            placeholder="0"
                                            {...filtersTariffRegister('smsTariff.min', {
                                                validate: {
                                                    positive: (v) => Number(v) >= 0,
                                                },
                                            })}
                                            onChange={() => unregisterFiltersTariffs('smsTariff.min')}
                                            isInvalid={!!errors.smsTariff?.min?.type}
                                        />
                                        <Form.Control.Feedback type="invalid">Число больше нуля</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                                <Col sm="3">
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text>до</InputGroup.Text>
                                        <Form.Control
                                            placeholder="0"
                                            {...filtersTariffRegister('smsTariff.max', {
                                                validate: {
                                                    positive: (v) => Number(v) >= 0,
                                                },
                                            })}
                                            onChange={() => unregisterFiltersTariffs('smsTariff.max')}
                                            isInvalid={!!errors.smsTariff?.max?.type}
                                        />
                                        <Form.Control.Feedback type="invalid">Число больше нуля</Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>
                            <Col sm="11">
                                <Button type="submit" className="tariffs-submit" data-testid="filters_submit">
                                    Применить
                                </Button>
                            </Col>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="tariffs-slider-container">
                <TariffsSlider tariffs={filteredTariffs} tariffIdSelect={tariffInfoRes?.tariff.id || ''} />
            </div>
        </div>
    );
});
