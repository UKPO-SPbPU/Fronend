import {memo} from 'react';
import {User} from '../types';
import {UserData} from './components/userData';
import {UserForm} from './components/userForm';
import {useQuery} from '@tanstack/react-query';
import {baseURL, TOKEN_KEY, PHONE_KEY} from '../../constants';
import {Alert} from 'react-bootstrap';

export const PersonalData = memo(function PersonalData() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const phoneNumber = sessionStorage.getItem(PHONE_KEY);

    const {data: user, error} = useQuery<User>({
        queryKey: ['user'],
        queryFn: () =>
            fetch(`${baseURL}/user/info/${phoneNumber}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json()),
    });

    if (error) {
        return <Alert className="center">Ошибка сервера</Alert>;
    }

    if (user === undefined) {
        return null
    }

    return (
        <div className="m-4">
            <UserData user={user} />
            <UserForm user={user} className="mt-4" />
        </div>
    );
});
