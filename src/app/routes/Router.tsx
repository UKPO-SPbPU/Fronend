import {memo, useMemo} from 'react';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';

import {Routes} from './Routes';
import {Layout} from '../components';
import {Tariffs} from '../../tariffs';
import {Login} from '../../login';
import {RequireAuth} from './RequireAuth';
import {PersonalAccount} from '../../personalAccount/PersonalAccount';
import {PersonalData} from '../../personalAccount/personalData';
import {Tariff} from '../../personalAccount/tariff';
import {Register} from '../../register';
import {Reports} from '../../reports';

export const useRoutes = () => {
    return createRoutesFromElements(
        <Route>
            <Route path={Routes.LOGIN} element={<Login />} />
            <Route path={Routes.REGISTER} element={<Register />} />
            <Route
                path={Routes.MAIN_PAGE}
                element={
                    <RequireAuth>
                        <Layout />
                    </RequireAuth>
                }
            >
                {/*Тарифы*/}
                <Route path={Routes.TARIFFS} element={<Tariffs />} />

                <Route path={Routes.REPORTS} element={<Reports />} />

                {/*Личный кабинет*/}
                <Route path={Routes.PERSONAL_ACCOUNT} element={<PersonalAccount />}>
                    <Route path={Routes.PERSONAL_DATA} element={<></>} />
                    <Route path={Routes.TARIFF} element={<></>} />
                </Route>
            </Route>
            ,
        </Route>,
    );
};

export const Router = memo(function Router() {
    const router = useMemo(() => createBrowserRouter(useRoutes()), []);

    return <RouterProvider router={router} />;
});
