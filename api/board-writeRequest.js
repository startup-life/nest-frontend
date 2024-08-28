import { getServerUrl, getCookie } from '../utils/function.js';

export const createPost = (boardData) => {
    const result = fetch(`${getServerUrl()}/post`, {
        method: 'POST',
        body: JSON.stringify(boardData),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
    });
    return result;
};

export const updatePost = (postId, boardData) => {
    const result = fetch(`${getServerUrl()}/post/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(boardData),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
    });

    return result;
};

export const fileUpload = (formData) => {
    const result = fetch(`${getServerUrl()}/upload/post`, {
        method: 'POST',
        body: formData,
    });

    return result;
};

export const getBoardItem = (postId) => {
    const result = fetch(`${getServerUrl()}/post/${postId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
        noCORS: true,
    });

    return result;
};
