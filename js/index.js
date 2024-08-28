import BoardItem from '../component/board/boardItem.js';
import Header from '../component/header/header.js';
import {
    getServerUrl,
    prependChild,
    serverSessionCheck,
} from '../utils/function.js';
import getPosts from '../api/indexRequest.js';

const DEFAULT_PROFILE_IMAGE = '/image/profile/default.jpg';
const HTTP_NOT_AUTHORIZED = 401;
const SCROLL_THRESHOLD = 0.9;
const INITIAL_OFFSET = 5;
const ITEMS_PER_LOAD = 5;

// getBoardItem 함수
const getBoardItem = async (offset = 0, limit = 5) => {
    const response = await getPosts(offset, limit);
    if (!response.ok || response.status !== 200) {
        throw new Error('Failed to load post list.');
    }

    const data = await response.json();
    return data;
};

const setBoardItem = (boardData) => {
    const boardList = document.querySelector('.boardList');
    console.log(boardData);
    if (boardList && boardData) {
        const itemsHtml = boardData
            .map((data) =>
                BoardItem(
                    data.postId,
                    data.createdAt,
                    data.postTitle,
                    data.hits,
                    data.profileImagePath,
                    data.nickname,
                    data.commentCount,
                    data.like
                )
            )
            .join('');
        boardList.innerHTML += ` ${itemsHtml}`;
    }
};

// 스크롤 이벤트 추가
const addInfinityScrollEvent = () => {
    let offset = INITIAL_OFFSET;
    let isEnd = false;
    let isProcessing = false;

    window.addEventListener('scroll', async () => {
        const hasScrolledToThreshold =
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight * SCROLL_THRESHOLD;
        if (hasScrolledToThreshold && !isProcessing && !isEnd) {
            isProcessing = true;

            try {
                const newItems = await getBoardItem(offset, ITEMS_PER_LOAD);
                if (!newItems || newItems.length === 0) {
                    isEnd = true;
                } else {
                    offset += ITEMS_PER_LOAD;
                    setBoardItem(newItems);
                }
            } catch (error) {
                console.error('Error fetching new items:', error);
                isEnd = true;
            } finally {
                isProcessing = false;
            }
        }
    });
};

const init = async () => {
    try {
        const response = await serverSessionCheck();
        const data = await response.json();
        if (response.status === HTTP_NOT_AUTHORIZED) {
            window.location.href = '/html/login.html';
            return;
        }

        const profileImagePath = data.profileImagePath ?? DEFAULT_PROFILE_IMAGE;
        const fullProfileImagePath = `${getServerUrl()}${profileImagePath}`;
        prependChild(
            document.body,
            Header('Community', 0, fullProfileImagePath)
        );

        const boardList = await getBoardItem();
        setBoardItem(boardList);

        addInfinityScrollEvent();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
};

init();
