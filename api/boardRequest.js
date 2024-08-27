import { getServerUrl, getCookie } from '../utils/function.js';

export const getPost = postId => {
    const result = fetch(`${getServerUrl()}/post/${postId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`,
        },
        noCORS: true,
    });
    return result;
};

export const deletePost = async postId => {
    const result = await fetch(`${getServerUrl()}/post/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`,
        },
    });
    return result;
};

export const writeComment = async (pageId, comment) => {
    const result = await fetch(`${getServerUrl()}/comment/post/${pageId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`,
        },
        body: JSON.stringify({ commentContent: comment }),
    });
    return result;
};

export const getComments = async postId => {
    const result = await fetch(`${getServerUrl()}/posts/${postId}/comments`, {
        headers: {
            session: getCookie('session'),
            userId: getCookie('userId'),
        },
        noCORS: true,
    });
    return result;
};
