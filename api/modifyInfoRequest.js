import { getServerUrl, getCookie } from '../utils/function.js';

export const userModify = async (userId, changeData) => {
    const result = await fetch(`${getServerUrl()}/user/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
        body: JSON.stringify(changeData),
    });
    return result;
};

export const userDelete = async (userId) => {
    const result = await fetch(`${getServerUrl()}/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
    });
    return result;
};
