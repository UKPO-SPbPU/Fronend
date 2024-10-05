import {memo} from 'react';
import {TariffData} from './components/tariffData';
import {TariffDescription} from './components/tariffDescription';
import {Alert, Button} from 'react-bootstrap';
import {Routes} from '../../app/routes/Routes';
import {baseURL, PHONE_KEY, TOKEN_KEY} from '../../constants';
import {Tariff as TariffInfo} from '../../tariffs/types';
import {useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {User} from '../types';

export const Tariff = memo(function Tariff() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem(TOKEN_KEY);
    const phoneNumber = sessionStorage.getItem(PHONE_KEY);

    const {data: user} = useQuery<User>({
        queryKey: ['user'],
        queryFn: () =>
            fetch(`${baseURL}/user/info/${phoneNumber}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json()),
    });

    const {data: tariffRes} = useQuery<{tariff: TariffInfo}>({
        queryKey: ['tariff'],
        queryFn: () =>
            fetch(`${baseURL}/tariff/${phoneNumber}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json()),
    });

    const handleChangeTariff = () => {
        navigate(Routes.TARIFFS);
    };

    if (tariffRes === undefined || user === undefined) {
        return null;
    }

    if (tariffRes.tariff?.id === null) {
        return (
            <div className="m-4">
                <Alert className="center">Тариф не подключен</Alert>
                <Button variant="primary" className="mt-3" onClick={handleChangeTariff} data-testid="connect">
                    ПОДКЛЮЧИТЬ ТАРИФ
                </Button>
            </div>
        );
    }

    return (
        <div className="m-4">
            <TariffData title={tariffRes?.tariff?.title ?? ''} />
            <div className="mt-4">
                <TariffDescription tariff={tariffRes?.tariff} contractDate={user.contractDate} />
            </div>
            <Button variant="primary" className="mt-3" onClick={handleChangeTariff} data-testid="change">
                ИЗМЕНИТЬ ТАРИФ
            </Button>
        </div>
    );
});
