import {memo} from "react";
import {User} from "../../../types";

import './UserData.css';
import {Heading} from "../../../components";


interface UserDataProps {
    user: User,
}

export const UserData = memo(function UserData({user}: UserDataProps) {
    const phone =
        (user.phoneNumber.slice(0, 1) === '7' ? '+' : '') +
        user.phoneNumber.slice(0, 1) +
        ' (' +
        user.phoneNumber.slice(1, 4) +
        ') ' +
        user.phoneNumber.slice(4, 7) +
        '-' +
        user.phoneNumber.slice(7, 9) +
        '-' +
        user.phoneNumber.slice(9, 11);

    return (
        <Heading header={user.fio} description={phone}/>
    )
})