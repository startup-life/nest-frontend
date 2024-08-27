import { getServerUrl, getCookie } from '../utils/function.js';

export const changePassword = async (userId, password) => {
    const result = fetch(`${getServerUrl()}/user/${userId}/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`,
        },
        body: JSON.stringify({
            password,
        }),
    });
    return result;
};
