import CommentItem from '../component/comment/comment.js';
import Dialog from '../component/dialog/dialog.js';
import Header from '../component/header/header.js';
import {
    authCheck,
    getServerUrl,
    padTo2Digits,
    prependChild,
    serverSessionCheck,
} from '../utils/function.js';
import {
    deletePost,
    getComments,
    getPost,
    writeComment,
} from '../api/boardRequest.js';

const DEFAULT_PROFILE_IMAGE = '/image/profile/default.jpg';
const MAX_COMMENT_LENGTH = 1000;
const HTTP_NOT_AUTHORIZED = 401;
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_END = 204;

const getQueryString = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

const getBoardDetail = async (postId) => {
    const response = await getPost(postId);
    if (!response.ok || response.status !== HTTP_OK)
        return new Error('게시글 정보를 가져오는데 실패하였습니다.');

    return response.json();
};

const setBoardDetail = (data) => {
    // 헤드 정보
    const titleElement = document.querySelector('.title');
    const createdAtElement = document.querySelector('.createdAt');
    const imgElement = document.querySelector('.img');
    const nicknameElement = document.querySelector('.nickname');

    titleElement.textContent = data.postTitle;
    const date = new Date(data.createdAt);
    const formattedDate = `${date.getFullYear()}-${padTo2Digits(date.getMonth() + 1)}-${padTo2Digits(date.getDate())} ${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}:${padTo2Digits(date.getSeconds())}`;
    createdAtElement.textContent = formattedDate;
    console.log(data);
    imgElement.src =
        data.profileImagePath === undefined || data.profileImagePath === null
            ? `${getServerUrl()}${DEFAULT_PROFILE_IMAGE}`
            : `${getServerUrl()}${data.profileImagePath}`;

    nicknameElement.textContent = data.nickname;

    // 바디 정보
    const contentImgElement = document.querySelector('.contentImg');
    if (data.filePath) {
        const img = document.createElement('img');
        img.src = `${getServerUrl()}${data.filePath}`;
        contentImgElement.appendChild(img);
    }
    const contentElement = document.querySelector('.content');
    contentElement.textContent = data.postContent;

    const viewCountElement = document.querySelector('.viewCount h3');
    // hits에 K, M 이 포함되어 있을 경우 그냥 출력
    // 포함되어 있지 않다면 + 1
    viewCountElement.textContent = data.hits;
    /*
    if (data.hits.includes('K') || data.hits.includes('M')) {
        viewCountElement.textContent = data.hits;
    } else {
        viewCountElement.textContent = (
            parseInt(data.hits, 10) + 1
        ).toLocaleString();
    }
    */

    const commentCountElement = document.querySelector('.commentCount h3');
    // commentCountElement.textContent = data.comment_count.toLocaleString();
    commentCountElement.textContent = data.commentCount;
};

const setBoardModify = async (data, myInfo) => {
    if (myInfo.idx === data.writerId) {
        const modifyElement = document.querySelector('.hidden');
        modifyElement.classList.remove('hidden');

        const modifyBtnElement = document.querySelector('#deleteBtn');
        const postId = getQueryString('id');
        modifyBtnElement.addEventListener('click', () => {
            Dialog(
                '게시글을 삭제하시겠습니까?',
                '삭제한 내용은 복구 할 수 없습니다.',
                async () => {
                    const response = await deletePost(postId);
                    if (response.status === HTTP_END) {
                        window.location.href = '/';
                    } else {
                        Dialog('삭제 실패', '게시글 삭제에 실패하였습니다.');
                    }
                }
            );
        });

        const modifyBtnElement2 = document.querySelector('#modifyBtn');
        modifyBtnElement2.addEventListener('click', () => {
            window.location.href = `/html/board-modify.html?post_id=${data.postId}`;
        });
    }
};

const getBoardComment = async (id) => {
    const response = await getComments(id);
    if (!response.ok || response.status !== HTTP_OK) return [];

    const data = await response.json();
    if (data || data !== null) {
        return data;
    }
};

const setBoardComment = (data, myInfo) => {
    const commentListElement = document.querySelector('.commentList');
    if (commentListElement) {
        data.map((event) => {
            const item = CommentItem(
                event,
                myInfo.userId,
                event.postId,
                event.commentId
            );
            commentListElement.appendChild(item);
        });
    }
};

const addComment = async () => {
    const comment = document.querySelector('textarea').value;
    const pageId = getQueryString('id');

    const response = await writeComment(pageId, comment);

    if (response.status === HTTP_CREATED) {
        window.location.reload();
    } else {
        Dialog('댓글 등록 실패', '댓글 등록에 실패하였습니다.');
    }
};

const inputComment = async () => {
    const textareaElement = document.querySelector(
        '.commentInputWrap textarea'
    );
    const commentBtnElement = document.querySelector('.commentInputBtn');

    if (textareaElement.value.length > MAX_COMMENT_LENGTH) {
        textareaElement.value = textareaElement.value.substring(
            0,
            MAX_COMMENT_LENGTH
        );
    }
    if (textareaElement.value === '') {
        commentBtnElement.disabled = true;
        commentBtnElement.style.backgroundColor = '#ACA0EB';
    } else {
        commentBtnElement.disabled = false;
        commentBtnElement.style.backgroundColor = '#7F6AEE';
    }
};

const init = async () => {
    try {
        const myInfoResult = await serverSessionCheck();
        const myInfoData = await myInfoResult.json();
        if (myInfoResult.status !== HTTP_OK) {
            throw new Error('사용자 정보를 불러오는데 실패하였습니다.');
        }

        const myInfo = myInfoData;
        const commentBtnElement = document.querySelector('.commentInputBtn');
        const textareaElement = document.querySelector(
            '.commentInputWrap textarea'
        );
        textareaElement.addEventListener('input', inputComment);
        commentBtnElement.addEventListener('click', addComment);
        commentBtnElement.disabled = true;

        const data = await authCheck();
        if (data.status === HTTP_NOT_AUTHORIZED) {
            window.location.href = '/html/login.html';
        }
        const profileImage =
            data.profileImagePath === undefined
                ? `${getServerUrl()}${DEFAULT_PROFILE_IMAGE}`
                : `${getServerUrl()}${data.profileImagePath}`;

        prependChild(document.body, Header('커뮤니티', 2, profileImage));

        const pageId = getQueryString('id');

        const pageData = await getBoardDetail(pageId);

        if (parseInt(pageData.userId, 10) === parseInt(myInfo.userId, 10)) {
            setBoardModify(pageData, myInfo);
        }
        setBoardDetail(pageData);

        getBoardComment(pageId).then((data) => setBoardComment(data, myInfo));
    } catch (error) {
        console.error(error);
    }
};

init();
