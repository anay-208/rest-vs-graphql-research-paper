import http from 'k6/http';
import { sleep } from 'k6';

const GRAPHQL_URL = __ENV.GRAPHQL_URL;

export const options = {
    scenarios: {
        default: {
            executor: 'shared-iterations',
            vus: 1,
            iterations: 30,
            maxDuration: '30m',
        }
    }
};

const query = JSON.stringify({
    query: `{
        post(id: "1") {
            title
            body
            author {
                name
                avatarUrl
            }
            comments {
                body
                author {
                    name
                    avatarUrl
                }
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

    console.log(JSON.stringify({
        scenario: 'graphql-scenario3',
        total_requests: 1,
        total_payload_bytes: res.body.length,
        total_time_ms: totalTime,
        comment_count: data.comments.length,
    }));

}