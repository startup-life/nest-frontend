import { getServerUrl } from '../utils/function.js';

export const userLogin = async (email, password) => {
    const response = await fetch(`${getServerUrl()}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    return response;
};

export const checkNickname = async (nickname) => {
    return fetch(`${getServerUrl()}/user/check/nickname?nickname=${nickname}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
