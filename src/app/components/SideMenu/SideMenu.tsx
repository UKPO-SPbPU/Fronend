import {memo, useCallback, useState} from 'react';
import './sideMenu.css';
import {Routes} from '../../routes';
import {Button, Modal} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {TOKEN_KEY} from '../../../constants';

export const SideMenu = memo(function SideMenu() {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleLogOut = useCallback(() => {
        sessionStorage.setItem(TOKEN_KEY, '');
        setShowModal(false);
        navigate(Routes.LOGIN);
    }, [setShowModal, navigate]);

    const handleOpen = useCallback(() => {
        setShowModal(true);
    }, [setShowModal]);

    const handleClose = useCallback(() => {
        setShowModal(false);
    }, [setShowModal]);

    const onClickReport = useCallback(() => {
        navigate(Routes.REPORTS);
    }, []);

    return (
        <>
            <div className="side-menu">
                <div className="side-menu-container">
                    <div className="side-menu-container-two">
                        <div className="side-menu-header">
                            <div className="side-menu-header-div">
                                <div className="side-menu-header-container">
                                    <div className="side-menu-kklr">KKLR</div>
                                    <div className="side-menu-logo-container">
                                        <div style={{marginBottom: '-2px'}}>Billing</div>
                                        <div style={{marginTop: '-2px'}}>system</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="side-menu-content">
                            <nav className="side-menu-content-menu">
                                <ul className="side-menu-content-menu-ul">
                                    <li className="side-menu-item">
                                        <div className="side-menu-item-container" tabIndex={0} role="button">
                                            <i className="bi-person-fill side-menu-item-icon fa-lg"></i>
                                            <a className="side-menu-item-link" href={Routes.PERSONAL_ACCOUNT}>
                                                Личный кабинет
                                            </a>
                                        </div>

                                        <div className="side-menu-item-container" tabIndex={0} role="button">
                                            <i className="bi-justify side-menu-item-icon fa-lg"></i>
                                            <a className="side-menu-item-link" href={Routes.TARIFFS}>
                                                Тарифы
                                            </a>
                                        </div>

                                        <div
                                            className="side-menu-item-container"
                                            tabIndex={0}
                                            role="button"
                                            data-testid="reports"
                                            onClick={onClickReport}
                                        >
                                            <i className="bi-newspaper side-menu-item-icon fa-lg"></i>
                                            <a className="side-menu-item-link">Отчеты</a>
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="side-menu-item">
                            <li className="side-menu-footer-li">
                                <div className="side-menu-item-container" tabIndex={0} role="button">
                                    <i className="bi-box-arrow-right side-menu-item-icon fa-lg"></i>
                                    <div onClick={handleOpen} data-testid="logout">
                                        Выйти
                                    </div>
                                </div>
                            </li>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтвердите действие</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Выход</h4>
                    <p>Вы точно уверены, что хотите выйти?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Нет
                    </Button>
                    <Button onClick={handleLogOut} data-testid="submit_logout">
                        Да
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});
