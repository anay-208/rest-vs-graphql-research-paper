import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = __ENV.REST_URL;

export const options = {
    maxDuration: '30m',
    iterations: 30,
    vus: 1,
};

export default function () {
    const startTime = Date.now();

    const postsRes = http.get(`${BASE_URL}/posts`);
    const posts = JSON.parse(postsRes.body);

    let totalRequests = 1;
    let totalPayload = postsRes.body.length;

    const uniqueUserIds = [...new Set(posts.map(p => p.userId))];
    for (const userId of uniqueUserIds) {
        const userRes = http.get(`${BASE_URL}/users/${userId}`);
        totalPayload += userRes.body.length;
        totalRequests++;
    }

    const totalTime = Date.now() - startTime;

    console.log(JSON.stringify({
        scenario: 'rest-scenario1',
        total_requests: totalRequests,
        total_payload_bytes: totalPayload,
        total_time_ms: totalTime,
    }));

}