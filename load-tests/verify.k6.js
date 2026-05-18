import http from 'k6/http';
import { check, sleep } from 'k6';

// Test Configuration
export const options = {
    scenarios: {
        // Stress test scenario: 10,000 concurrent users over a period of time
        stress_test: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 2000 },  // Ramp up to 2000 users over 2 mins
                { duration: '5m', target: 10000 }, // Ramp up to 10000 concurrent users over 5 mins
                { duration: '5m', target: 10000 }, // Hold at 10000 users for 5 mins
                { duration: '3m', target: 0 },     // Ramp down to 0 users over 3 mins
            ],
        },
        // Spike test scenario: sudden surge in traffic (5x)
        spike_test: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 1000 }, // Very quick ramp up
                { duration: '1m', target: 5000 },  // Spike to 5000 users
                { duration: '30s', target: 0 },    // Quick cool down
            ],
            startTime: '16m', // Start after stress test finishes
        }
    },
    thresholds: {
        // Response time SLA: p95 < 500ms under normal load
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
    },
};

// Simulated data
const mockTokens = ['KPN-1234', 'kpn-5678', 'INVALID-TOKEN', 'KPN-TEST-99'];

// The default function represents a single VU (Virtual User) iteration
export default function () {
    // Determine target URL (replace with actual backend API in production)
    // For local testing, assuming the verification endpoint is /api/verify
    const targetUrl = __ENV.API_URL || 'http://localhost:3000/api/verify';
    
    // Pick a random token from our mock set
    const token = mockTokens[Math.floor(Math.random() * mockTokens.length)];
    
    const payload = JSON.stringify({
        token: token,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'X-Client-ID': 'k6-load-tester',
        },
    };

    // Execute the POST request to the verify endpoint
    const res = http.post(targetUrl, payload, params);

    // Validate the response
    check(res, {
        'status is 200 or 400': (r) => r.status === 200 || r.status === 400,
        'transaction completed quickly': (r) => r.timings.duration < 500,
    });

    // Pause briefly between iterations to simulate real user behavior
    sleep(Math.random() * 2 + 1); // sleep between 1 to 3 seconds
}
