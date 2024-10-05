import {memo} from 'react';
import {Outlet} from 'react-router-dom';
import {SideMenu} from '../SideMenu';
import './Layout.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Header} from '../Header';

export const Layout = memo(function Layout() {
    // Наш App.tsx
    return (
        <div className="layout-container">
            <SideMenu />
            <div style={{width: '100%', height: '100%', overflow: 'auto'}}>
                <Header />
                <Outlet />
            </div>
        </div>
    );
});
