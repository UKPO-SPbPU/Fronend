import {memo} from "react";
import {Col, Container, Row} from "react-bootstrap";

import {Tariff} from "../../../../tariffs/types";
import {getTariffCost} from "../../../../tariffs/logic/filterTariffs";
import {getTariffSMSCount} from "../../../../tariffs/logic/tariffSMS";
import {getNearestWithdrawal} from "../../logic/tariffDate";

import './TariffDescription.css';

interface TariffDescriptionProps {
    tariff: Tariff;
    contractDate: string;
}

export const TariffDescription = memo(function TariffDescription(props: TariffDescriptionProps) {
    const {tariff, contractDate} = props;
    const cost = getTariffCost(tariff);
    const internet = tariff.internetPackage === null ? 0 : Number((tariff.internetPackage?.packOfMB ?? 0) / 1024).toFixed(2);
    const messagesCount = getTariffSMSCount(tariff.id ?? '');
    const nearestWithdrawal = getNearestWithdrawal(contractDate);

    return (
        <Container className='tariff-description'>
            <Row className='mb-4'>
                <Col sm={3}>Абонентская плата</Col>
                <Col sm={5}>
                    <p className='tariff-description-info'>{cost} ₽/МЕС</p>
                    <p className='tariff-description-date'>Ближайшее списание: {nearestWithdrawal}</p>
                </Col>
            </Row>

            <Row className='mb-5'>
                <Col sm={3}>Звонки</Col>
                <Col sm={5}>
                    <p className='tariff-description-info'>{tariff.telephonyPackage?.packOfMinutes ?? 0} МИН</p>
                </Col>
            </Row>

            <Row className='mb-5'>
                <Col sm={3}>Интернет</Col>
                <Col sm={5}>
                    <p className='tariff-description-info'>{internet} ГБ</p>
                </Col>
            </Row>

            <Row className='mb-5'>
                <Col sm={3}>SMS</Col>
                <Col sm={5}>
                    <p className='tariff-description-info'>{messagesCount} ШТ</p>
                </Col>
            </Row>
        </Container>
    )
})