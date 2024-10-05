import {memo, useState} from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import {Outlet} from 'react-router-dom';
import {Tariff} from './tariff';
import {PersonalData} from './personalData';

export const PersonalAccount = memo(function PersonalAccount() {
    const [key, setKey] = useState('personalData');

    const handleSelectKey = (key: string | null) => {
        setKey(key!);
    };

    return (
        <>
            <Tabs activeKey={key} onSelect={handleSelectKey}>
                <Tab eventKey="personalData" title="Личные данные">
                    <PersonalData />
                </Tab>
                <Tab eventKey="tariff" title="Тариф">
                    <Tariff />
                </Tab>
            </Tabs>
            <Outlet />
        </>
    );
});
