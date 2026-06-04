import http from 'k6/http';
import { sleep } from 'k6';

const GRAPHQL_URL = __ENV.GRAPHQL_URL;

export const options = {
    iterations: 30,
    vus: 1,
};

const query = JSON.stringify({
    query: `{
        posts {
            title
            body
            author {
                name
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

    console.log(JSON.stringify({
        scenario: 'graphql-scenario1',
        total_requests: 1,
        total_payload_bytes: res.body.length,
        total_time_ms: totalTime,
    }));

    sleep(0.5);
}