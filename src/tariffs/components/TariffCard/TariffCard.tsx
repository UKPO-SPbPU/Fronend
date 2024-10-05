import {Dispatch, memo, SetStateAction, useCallback, useMemo, useState} from 'react';
import {Button, Card, Modal} from 'react-bootstrap';

import {Tariff} from '../../types';

import '../TariffSlider/TariffSlider.css';
import {getTariffCost} from '../../logic/filterTariffs';
import {baseURL, PHONE_KEY, TOKEN_KEY} from '../../../constants';
import {getTariffSMSCount} from '../../logic/tariffSMS';

export interface PropsTariff {
    tariff: Tariff;
    tariffId: string;
    onSetTariffId: Dispatch<SetStateAction<string>>;
}

export const TariffCard = memo(function TariffCard({tariff, tariffId, onSetTariffId}: PropsTariff) {
    const {id, telephonyPackage, title, description, internetPackage} = tariff;
    const token = sessionStorage.getItem(TOKEN_KEY);
    const phoneNumber = sessionStorage.getItem(PHONE_KEY);
    const [showModal, setShowModal] = useState(false);

    const tariffCost = useMemo(() => getTariffCost(tariff), [tariff]);

    const handleSubmit = useCallback(async () => {
        try {
            const res = await fetch(`${baseURL}/changeTariff?phoneNumber=${phoneNumber}&tariffCode=${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const message = `An error has occured: ${res.status} - ${res.statusText}`;
                throw new Error(message);
            }
        } catch (err) {
            console.error(err);
        }

        onSetTariffId(id);
        setShowModal(false);
    }, [id, onSetTariffId, phoneNumber, token]);

    const handleOpen = useCallback(() => {
        setShowModal(true);
    }, [setShowModal]);

    const handleClose = useCallback(() => {
        setShowModal(false);
    }, [setShowModal]);

    const messagesCount = getTariffSMSCount(tariff.id);

    return (
        <li className="card">
            <Card.Body className="tariff-card-body">
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{description}</Card.Subtitle>
                <div>
                    <div>
                        Стоимость тарифа - <span className="fw-bold">{tariffCost}</span>
                    </div>
                    <div>
                        Кол-во минут - <span className="fw-bold">{telephonyPackage?.packOfMinutes ?? 0}</span>
                    </div>
                    <div>
                        Кол-во сообщений - <span className="fw-bold">{messagesCount}</span>
                    </div>
                    <div>
                        Кол-во Гб интернета -{' '}
                        <span className="fw-bold">{Number((internetPackage?.packOfMB ?? 0) / 1024).toFixed(2)}</span>
                    </div>
                </div>
                <Button
                    className="tariff-card-submit"
                    onClick={handleOpen}
                    disabled={id === tariffId}
                    data-testid={`tariff-${id}`}
                >
                    Подключить
                </Button>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Подтвердите действие</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Смена тарифа</h4>
                        <p>Вы точно уверены, что хотите сменить тариф?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Нет
                        </Button>
                        <Button onClick={handleSubmit} data-testid="submit-modal">
                            Да
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </li>
    );
});
