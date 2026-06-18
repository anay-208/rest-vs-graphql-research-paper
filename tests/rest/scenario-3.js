import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = __ENV.REST_URL;

export const options = {
    scenarios: {
        default: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 30,
            maxDuration: '30m',
        }
    }
};

export default function () {
    const startTime = Date.now();

    const postRes = http.get(`${BASE_URL}/posts/1`);
    const post = JSON.parse(postRes.body);
    let totalPayload = postRes.body.length;
    let totalRequests = 1;

    const authorRes = http.get(`${BASE_URL}/users/${post.userId}`);
    totalPayload += authorRes.body.length;
    totalRequests++;

    const commentsRes = http.get(`${BASE_URL}/posts/1/comments`);
    const comments = JSON.parse(commentsRes.body);
    totalPayload += commentsRes.body.length;
    totalRequests++;

    const uniqueCommenterIds = [...new Set(comments.map(c => c.userId))];
    for (const userId of uniqueCommenterIds) {
        const commenterRes = http.get(`${BASE_URL}/users/${userId}`);
        totalPayload += commenterRes.body.length;
        totalRequests++;
    }

    const totalTime = Date.now() - startTime;

    console.log(JSON.stringify({
        scenario: 'rest-scenario3',
        total_requests: totalRequests,
        total_payload_bytes: totalPayload,
        total_time_ms: totalTime,
        unique_commenters: uniqueCommenterIds.length,
    }));

}