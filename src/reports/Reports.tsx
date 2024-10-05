import {memo, useRef, useState} from 'react';
import {Button, Col, Form, Row, Table} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import {RotateLoader} from 'react-spinners';
import {useDownloadExcel} from 'react-export-table-to-excel';

import {baseURL, PHONE_KEY, TOKEN_KEY} from '../constants';

import 'react-datepicker/dist/react-datepicker.css';
import './Reports.css';

interface Call {
    callTypeCode: string;
    startDateTime: string;
    endDateTime: string;
    duration: string;
    cost: number;
}

interface Report {
    phoneNumber: number;
    tariffCode: number;
    callsList: Call[];
    totalMinutes: number;
    totalCost: number;
}

export const Reports = memo(function Reports() {
    const date = new Date();
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    const [startDate, setStartDate] = useState(prevDate);
    const [endDate, setEndDate] = useState(date);
    const [report, setReport] = useState<Report>();
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const tableRef = useRef(null);

    const months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ];

    const locale = {
        localize: {
            month: (n: number) => months[n],
        },
        formatLong: {
            date: () => 'yyyy-mm-dd',
        },
    } as Locale;

    const {onDownload: handleDownloadReport} = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'report',
        sheet: 'Report',
    });

    const handleChangeStartDate = (e: Date) => {
        setStartDate(e);
    };

    const handleChangeEndDate = (e: any) => {
        setEndDate(e);
    };

    const token = sessionStorage.getItem(TOKEN_KEY);
    const phoneNumber = sessionStorage.getItem(PHONE_KEY);

    const handleGenerateReport = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${baseURL}/tarifficate`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const message = `An error has occured: ${res.status} - ${res.statusText}`;
                throw new Error(message);
            }
        } catch (err) {
            console.error(err);
        }

        try {
            const formatStartDate = startDate.toISOString().slice(0, -5);
            const formatEndDate = endDate.toISOString().slice(0, -5);
            const res = await fetch(
                `${baseURL}/report?phoneNumber=${phoneNumber}&dateTimeStart=${formatStartDate}&dateTimeEnd=${formatEndDate}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            const response = await res.json();
            setReport(response);
            setIsLoading(false);
            setIsGenerated(true);

            if (!res.ok) {
                const message = `An error has occured: ${res.status} - ${res.statusText}`;
                throw new Error(message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyboardDateInput = (e: any) => {
        e.preventDefault();
    };

    return (
        <div className="m-4">
            <div className="">
                <Form as={Row}>
                    <Col sm="3">
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label>Начальный месяц</Form.Label>
                            <Col className="w-100">
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleChangeStartDate}
                                    showMonthYearPicker
                                    dateFormat="MMMM, yyyy"
                                    locale={locale}
                                    className="form-control"
                                    onChangeRaw={handleKeyboardDateInput}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col sm="3">
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label>Конечный месяц</Form.Label>
                            <Col>
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleChangeEndDate}
                                    showMonthYearPicker
                                    dateFormat="MMMM, yyyy"
                                    locale={locale}
                                    className="form-control"
                                    onChangeRaw={handleKeyboardDateInput}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col className="reports-btn">
                        <Row>
                            <Col sm="3">
                                <Button
                                    variant="primary"
                                    onClick={handleGenerateReport}
                                    className="w-100"
                                    data-testid="generateReportButton"
                                >
                                    Сгенерировать
                                </Button>
                            </Col>
                            <Col sm="3">
                                <Button
                                    variant="primary"
                                    className="w-100"
                                    onClick={handleDownloadReport}
                                    disabled={!isGenerated}
                                >
                                    Скачать
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Form>
            </div>
            <h5 className="report-heading">Отчет</h5>
            <hr className="hr-report" />
            {isLoading && (
                <div className="report-spinner" data-testid="reportSpinner">
                    <RotateLoader className="text-center m-auto" color="#5c31f1" size={35} margin={40} />
                </div>
            )}
            <Table striped hover ref={tableRef}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Тип звонка</th>
                        <th>Минуты</th>
                        <th>Стоимость</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading &&
                        report?.callsList?.map((call, index) => {
                            const callType = call.callTypeCode === '01' ? 'Входящий' : 'Исходящий';
                            const duration = call.duration.includes('M')
                                ? call.duration.slice(2).split('M')
                                : ['00', call.duration.slice(2)];
                            const secondsValue = duration[1].slice(0, -1);
                            const seconds =
                                secondsValue.length === 1
                                    ? `0${secondsValue}`
                                    : secondsValue.length === 2
                                      ? secondsValue
                                      : '00';
                            const minutes = duration[0].length === 1 ? `0${duration[0]}` : duration[0];
                            const resultDuration = `${minutes}:${seconds}`;

                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{callType}</td>
                                    <td>{resultDuration}</td>
                                    <td>{call.cost}</td>
                                </tr>
                            );
                        })}
                    {!isLoading && report && (
                        <tr>
                            <td colSpan={4}>
                                <h6 style={{float: 'right'}}>Всего: {report?.totalCost} ₽</h6>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <br />
        </div>
    );
});
