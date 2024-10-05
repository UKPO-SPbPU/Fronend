import {memo, ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {Routes} from './Routes';
import {TOKEN_KEY} from '../../constants';

interface Props {
    children: ReactNode;
}

export const RequireAuth = memo(function RequireAuth(props: Props) {
    const location = useLocation();
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (!token) {
        // Redirect to the /login page
        return <Navigate to={Routes.LOGIN} state={{from: location}} replace />;
    }

    return <>{props.children}</>;
});
