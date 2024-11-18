import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';

const app = express();
const PORT = 10000;

// JSON 데이터 읽기
const __dirname = path.resolve();
const districtsData = JSON.parse(
    readFileSync(path.join(__dirname, '../district-data/행정동_districts.json'), 'utf-8')
);


// GET /district
app.get('/district', (req, res) => {
    if (!districtsData) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Districts data not available',
        });
    }

    res.status(200).json(districtsData);
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
