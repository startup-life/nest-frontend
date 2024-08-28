import { getCookie, getServerUrl } from '../utils/function.js';

export const getPost = (postId) => {
    return fetch(`${getServerUrl()}/post/${postId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
        noCORS: true,
    });
};

export const deletePost = async (postId) => {
    return fetch(`${getServerUrl()}/post/${postId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
    });
};

export const writeComment = async (pageId, comment) => {
    return fetch(`${getServerUrl()}/comment/post/${pageId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
        body: JSON.stringify({ commentContent: comment }),
    });
};

export const getComments = async (postId) => {
    return fetch(`${getServerUrl()}/comment/post/${postId}`, {
        headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`,
        },
        noCORS: true,
    });
};
