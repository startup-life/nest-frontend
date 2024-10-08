import { checkNickname } from '../api/loginRequest.js';
import Dialog from '../component/dialog/dialog.js';
import Header from '../component/header/header.js';
import {
    authCheck,
    prependChild,
    getServerUrl,
    deleteCookie,
    validNickname,
    getUserIdFromJWT,
} from '../utils/function.js';
import { userModify, userDelete } from '../api/modifyInfoRequest.js';

const emailTextElement = document.querySelector('#id');
const nicknameInputElement = document.querySelector('#nickname');
const profileInputElement = document.querySelector('#profile');
const withdrawBtnElement = document.querySelector('#withdrawBtn');
const nicknameHelpElement = document.querySelector(
    '.inputBox p[name="nickname"]'
);
// const resultElement = document.querySelector('.inputBox p[name="result"]');
const modifyBtnElement = document.querySelector('#signupBtn');
const profilePreview = document.querySelector('#profilePreview');
// const authData = await authCheck();
// const changeData = {
//     nickname: authData.nickname,
//     profileImagePath: authData.profileImagePath,
// };
let authData; // 전역 변수로 선언하여 여러 곳에서 사용할 수 있게 함
const changeData = {
    nickname: '',
    profileImagePath: '',
};

const DEFAULT_PROFILE_IMAGE = '/image/profile/default.jpg';
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_END = 204;

// authData 초기화 함수
const initializeAuthData = () => {
    return authCheck()
        .then((data) => {
            authData = data; // Promise의 결과를 전역 변수에 할당
            changeData.nickname = authData.nickname;
            changeData.profileImagePath = authData.profileImagePath;
            init(); // 모든 초기화 작업을 init()에서 수행
        })
        .catch((error) => {
            console.error('인증 데이터 초기화 중 오류 발생:', error);
        });
};

const setData = (data) => {
    if (
        data.profileImagePath === DEFAULT_PROFILE_IMAGE ||
        data.profileImagePath === null
    ) {
        profilePreview.src = `${getServerUrl()}${DEFAULT_PROFILE_IMAGE}`;
    } else {
        profilePreview.src = `${getServerUrl()}${data.profileImagePath}`;
        console.log(data);
        const profileImagePath = data.profileImagePath;
        const fileName = profileImagePath.split('/').pop();
        localStorage.setItem('profilePath', data.profileImagePath);

        const profileImage = new File(
            [`${getServerUrl()}${profileImagePath}`],
            fileName,
            { type: '' }
        );

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(profileImage);
        profileInputElement.files = dataTransfer.files;
    }
    emailTextElement.textContent = data.email;
    nicknameInputElement.value = data.nickname;
};

const observeData = () => {
    const button = document.querySelector('#signupBtn');
    if (
        authData.nickname !== changeData.nickname ||
        authData.profileImagePath !== changeData.profileImagePath
    ) {
        button.disabled = false;
        button.style.backgroundColor = '#7F6AEE';
    } else {
        button.disabled = true;
        button.style.backgroundColor = '#ACA0EB';
    }
};

const changeEventHandler = async (event, uid) => {
    const button = document.querySelector('#signupBtn');
    if (uid === 'nickname') {
        const value = event.target.value;
        const isValidNickname = validNickname(value);
        const helperElement = nicknameHelpElement;
        let isComplete = false;
        if (value === '' || value == null) {
            helperElement.textContent = '*닉네임을 입력해주세요.';
        } else if (!isValidNickname) {
            helperElement.textContent =
                '*닉네임은 2~10자의 영문자, 한글 또는 숫자만 사용할 수 있습니다. 특수 문자와 띄어쓰기는 사용할 수 없습니다.';
        } else {
            const response = await checkNickname(value);
            const responseData = await response.json();
            if (response.status === HTTP_OK) {
                helperElement.textContent = '';
                isComplete = true;
            }
            if (authData.nickname === value) {
                helperElement.textContent = '';
                button.disabled = true;
                button.style.backgroundColor = '#ACA0EB';
                return;
            }
            if (responseData === true) {
                helperElement.textContent = '*중복된 닉네임 입니다.';
                button.disabled = true;
                button.style.backgroundColor = '#ACA0EB';
                return;
            }
        }
        if (isComplete) {
            changeData.nickname = value;
        } else {
            changeData.nickname = authData.nickname;
        }
    } else if (uid === 'profile') {
        // 사용자가 선택한 파일
        const file = event.target.files[0];
        if (!file) {
            localStorage.removeItem('profilePath');
            profilePreview.src = `${getServerUrl()}${DEFAULT_PROFILE_IMAGE}`;
            changeData.profileImagePath = null;
        } else {
            const formData = new FormData();
            formData.append('profileImage', file);

            // 파일 업로드를 위한 POST 요청 실행
            try {
                const response = await fetch(
                    `${getServerUrl()}/upload/profile`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok || response.status !== HTTP_CREATED)
                    throw new Error('서버 응답 오류');

                const result = await response.text();
                console.log(result);
                localStorage.setItem('profilePath', result);
                changeData.profileImagePath = result;
                profilePreview.src = `${getServerUrl()}${result}`;
            } catch (error) {
                console.error('업로드 중 오류 발생:', error);
            }
        }
    }
    observeData();
};

const sendModifyData = async () => {
    const userId = getUserIdFromJWT();
    const button = document.querySelector('#signupBtn');

    if (!button.disabled) {
        if (changeData.nickname === '') {
            Dialog('필수 정보 누락', '닉네임을 입력해주세요.');
        } else {
            const response = await userModify(userId, changeData);

            if (response.status === HTTP_OK) {
                localStorage.removeItem('profilePath');
                saveToastMessage('수정완료');
                location.href = '/html/modifyInfo.html';
            } else {
                localStorage.removeItem('profilePath');
                saveToastMessage('수정실패');
                location.href = '/html/modifyInfo.html';
            }
        }
    }
};

// 회원 탈퇴
const deleteAccount = async () => {
    const userId = getUserIdFromJWT();
    const callback = async () => {
        const response = await userDelete(userId);

        if (response.status === HTTP_END) {
            deleteCookie('accessToken');
            location.href = '/html/login.html';
        } else {
            Dialog('회원 탈퇴 실패', '회원 탈퇴에 실패했습니다.');
        }
    };

    Dialog(
        '회원탈퇴 하시겠습니까?',
        '작성된 게시글과 댓글은 삭제 됩니다.',
        callback
    );
};

const addEvent = () => {
    nicknameInputElement.addEventListener('change', (event) =>
        changeEventHandler(event, 'nickname')
    );
    profileInputElement.addEventListener('change', (event) =>
        changeEventHandler(event, 'profile')
    );
    modifyBtnElement.addEventListener('click', async () => sendModifyData());
    withdrawBtnElement.addEventListener('click', async () => deleteAccount());
};

const showToast = (message, duration = 3000, callback = null) => {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toastMessage');
    toast.textContent = message;

    container.appendChild(toast);

    // 메시지를 보여주기
    setTimeout(() => {
        toast.style.opacity = 1;
        // 조금 더 위로 올라가는 효과를 줄 수 있음
        toast.style.bottom = '30px';
    }, 100);

    // 메시지 숨기기 및 콜백 실행
    setTimeout(() => {
        toast.style.opacity = 0;
        // 원래 위치로 돌아가며 사라지는 효과
        toast.style.bottom = '20px';
        setTimeout(() => {
            // 페이드 아웃이 끝난 후 요소 제거
            toast.remove();
            // 콜백 함수가 있으면 실행
            if (callback) callback();
        }, 500); // CSS transition 시간에 맞춰 설정
    }, duration);
};

const saveToastMessage = (message) => {
    sessionStorage.setItem('toastMessage', message);
};

// 토스트 메시지 표시 및 저장소에서 삭제
const displayToastFromStorage = () => {
    const message = sessionStorage.getItem('toastMessage');
    if (message) {
        showToast(message, 3000, () => {
            // 메시지 삭제
            sessionStorage.removeItem('toastMessage');
        }); // 메시지를 표시하는 기존 함수 사용
    }
};

const init = () => {
    const profileImage =
        authData.profileImagePath === undefined
            ? `${getServerUrl()}${DEFAULT_PROFILE_IMAGE}`
            : `${getServerUrl()}${authData.profileImagePath}`;
    prependChild(document.body, Header('커뮤니티', 2, profileImage));
    setData(authData);
    observeData();
    addEvent();
    displayToastFromStorage();
};

initializeAuthData();
init();
