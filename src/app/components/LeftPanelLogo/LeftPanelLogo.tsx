import {memo} from 'react';

import './LeftPanelLogo.css';

export const LeftPanelLogo = memo(function LeftPanelLogo() {
    return (
        <div className="login-left-panel">
            <span className="login-left-panel-label">KKLR Billing System</span>
            <span className="login-left-panel-description">Лучшая биллинговая система для Вас!</span>
        </div>
    );
});
