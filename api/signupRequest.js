import { getServerUrl } from '../utils/function.js';

export const userSignup = async (data) => {
    return fetch(`${getServerUrl()}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

export const checkEmail = async (email) => {
    return fetch(`${getServerUrl()}/user/check/email?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const checkNickname = async (nickname) => {
    return fetch(`${getServerUrl()}/user/check/nickname?nickname=${nickname}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const fileUpload = async (file) => {
    return fetch(`${getServerUrl()}/upload/profile`, {
        method: 'POST',
        body: file,
    });
};
