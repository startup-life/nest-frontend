const HTTP_OK = 200;

export const getServerUrl = () => {
    const host = window.location.hostname;
    return host.includes('localhost')
        ? 'http://localhost:3000'
        : 'https://node-community-api.startupcode.kr:443';
};

export const setCookie = (cookie_name, value, days) => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정

    const cookie_value =
        escape(value) +
        (days == null ? '' : `; expires=${exdate.toUTCString()}`);
    document.cookie = `${cookie_name}=${cookie_value}`;
};

export const getCookie = (cookie_name) => {
    let x;
    let y;
    const val = document.cookie.split(';');

    for (let i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
        if (x == cookie_name) {
            return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
};

export const deleteCookie = (cookie_name) => {
    setCookie(cookie_name, '', -1);
};

export const serverSessionCheck = async () => {
    try {
        const response = await fetch(`${getServerUrl()}/auth/check`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`,
            },
        });

        if (response.status !== HTTP_OK) {
            deleteCookie('accessToken');
            location.href = '/html/login.html';
        }
        return response;
    } catch (error) {
        console.error(error);
        deleteCookie('accessToken');
        location.href = '/html/login.html';
    }
};

export const authCheck = async () => {
    try {
        const accessToken = getCookie('accessToken');
        if (!accessToken) {
            deleteCookie('accessToken');
            location.href = '/html/login.html';
        }

        const response = await serverSessionCheck();

        if (!response || response.status !== HTTP_OK) {
            deleteCookie('accessToken');
            location.href = '/html/login.html';
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        deleteCookie('accessToken');
        location.href = '/html/login.html';
    }
};

export const authCheckReverse = async () => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
        const response = await serverSessionCheck();
        const data = await response.json();
        if (data) {
            location.href = '/';
        }
    }
};
// 이메일 유효성 검사
export const validEmail = (email) => {
    const REGEX =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return REGEX.test(email);
};

export const validPassword = (password) => {
    const REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return REGEX.test(password);
};

export const validNickname = (nickname) => {
    const REGEX = /^[가-힣a-zA-Z0-9]{2,10}$/;
    return REGEX.test(nickname);
};

export const prependChild = (parent, child) => {
    parent.insertBefore(child, parent.firstChild);
};

/**
 *
 * @param {File} file  이미지 파일
 * @param {boolean} isHigh? : true면 origin, false면  1/4 사이즈
 * @returns
 */
export const fileToBase64 = (file, isHigh) => {
    return new Promise((resolve, reject) => {
        const size = isHigh ? 1 : 4;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const width = img.width / size;
                const height = img.height / size;
                const elem = document.createElement('canvas');
                elem.width = width;
                elem.height = height;
                const ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(ctx.canvas.toDataURL());
            };
            img.onerror = (e) => {
                reject(e);
            };
        };
        reader.onerror = (e) => {
            reject(e);
        };
    });
};

/**
 *
 * @param {string} param
 * @returns
 */
export const getQueryString = (param) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
};

export const padTo2Digits = (number) => {
    return number.toString().padStart(2, '0');
};

const base64UrlDecode = (str) => {
    // Base64Url 인코딩을 일반 Base64 인코딩으로 변환
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // 패딩 처리
    while (base64.length % 4) {
        base64 += '=';
    }
    // Base64 디코딩
    const decoded = atob(base64);
    return JSON.parse(decoded);
};

export const getUserIdFromJWT = () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
        console.error('No accessToken found');
        return null;
    }
    // JWT의 페이로드 디코딩
    const payload = base64UrlDecode(accessToken.split('.')[1]);
    return payload.userId;
};
