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

    const postRes = http.get(`${BASE_URL}/posts/1`);
    const post = JSON.parse(postRes.body);
    let totalPayload = postRes.body.length;

    const userRes = http.get(`${BASE_URL}/users/${post.userId}`);
    const user = JSON.parse(userRes.body);
    totalPayload += userRes.body.length;

    const totalTime = Date.now() - startTime;

    const usefulData = JSON.stringify({
        title: post.title,
        body: post.body,
        author: {
            name: user.name,
            email: user.email,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
        }
    }).length;

    console.log(JSON.stringify({
        scenario: 'rest-scenario2',
        total_requests: 2,
        total_payload_bytes: totalPayload,
        useful_payload_bytes: usefulData,
        overfetch_ratio: ((totalPayload - usefulData) / totalPayload * 100).toFixed(2),
        total_time_ms: totalTime,
    }));

}