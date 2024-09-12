import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = process.env.PORT;
const httpsKeyPath = process.env.HTTPS_KEY_PATH;
const httpsCertPath = process.env.HTTPS_CERT_PATH;

// 현재 파일의 URL에서 디렉토리 경로를 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect('/html/index.html');
});

if (process.env.NODE_ENV === 'production') {
    const httpsOptions = {
        key: fs.readFileSync(httpsKeyPath),
        cert: fs.readFileSync(httpsCertPath),
    };

    https.createServer(httpsOptions, app).listen(port, () => {
        console.log(`HTTPS Server is running on port ${port}`);
    });
} else {
    app.listen(port, () => {
        console.log(`HTTP Server is running on port ${port}`);
    });
}
