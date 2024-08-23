import { getServerUrl, getCookie } from '../utils/function.js';

export const userLogin = async (email, password) => {
    const result = await fetch(`${getServerUrl()}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });
    return result;
};

export const checkNickname = async nickname => {
    const result = fetch(
        `${getServerUrl()}/user/check/nickname?nickname=${nickname}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return result;
};
