import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const app = express();

dotenv.config({ path: './.env.dev' });

const PORT = process.env.PORT;

// 현재 파일의 URL에서 디렉토리 경로를 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect('/html/index.html');
});

// 서버 최초 시작시 모든 쿠키  삭제
app.use((req, res, next) => {
    res.clearCookie('accessToken');
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
