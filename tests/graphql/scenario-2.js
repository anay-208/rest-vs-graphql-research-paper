import http from 'k6/http';
import { sleep } from 'k6';

const GRAPHQL_URL = __ENV.GRAPHQL_URL;

export const options = {
    maxDuration: '30m',
    iterations: 30,
    vus: 1,
};

const query = JSON.stringify({
    query: `{
        post(id: "1") {
            title
            body
            author {
                name
                email
                bio
                avatarUrl       
            }
        }
    }`
});

export default function () {
    const startTime = Date.now();

    const res = http.post(GRAPHQL_URL, query, {
        headers: { 'Content-Type': 'application/json' },
    });

    const totalTime = Date.now() - startTime;
    const data = JSON.parse(res.body).data.post;
    const totalPayload = res.body.length;

    const usefulData = JSON.stringify({
        title: data.title,
        body: data.body,
        author: {
            name: data.author.name,
            email: data.author.email,
            bio: data.author.bio,
            avatarUrl: data.author.avatarUrl,
        }
    }).length;

    console.log(JSON.stringify({
        scenario: 'graphql-scenario2',
        total_requests: 1,
        total_payload_bytes: totalPayload,
        useful_payload_bytes: usefulData,
        overfetch_ratio: ((totalPayload - usefulData) / totalPayload * 100).toFixed(2),
        total_time_ms: totalTime,
    }));

}