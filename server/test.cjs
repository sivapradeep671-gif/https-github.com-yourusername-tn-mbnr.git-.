const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3001';
let testResults = [];
let passedTests = 0;
let failedTests = 0;

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(new Error(`Request failed: ${err.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Test assertion helper
function assert(condition, testName, message) {
    if (condition) {
        testResults.push(`✅ PASS: ${testName}`);
        passedTests++;
        return true;
    } else {
        testResults.push(`❌ FAIL: ${testName} - ${message}`);
        failedTests++;
        return false;
    }
}

// Test Suite: Quick API Tests (no waiting for expiry)
async function testAPIs() {
    console.log('\n📝 Testing Backend APIs...\n');

    // Test 1: Admin Shops API
    console.log('Test 1: GET /api/admin/shops...');
    try {
        const shopsResponse = await makeRequest('GET', '/api/admin/shops');

        assert(
            shopsResponse.status === 200,
            'Admin Shops API - Status Code',
            `Expected 200, got ${shopsResponse.status}`
        );

        assert(
            shopsResponse.data.message === 'success',
            'Admin Shops API - Response Format',
            'Expected success message'
        );

        assert(
            Array.isArray(shopsResponse.data.shops),
            'Admin Shops API - Shops Array',
            'Expected shops to be an array'
        );

        console.log(`   ✓ Total shops: ${shopsResponse.data.total}`);

    } catch (error) {
        assert(false, 'Admin Shops API - Request', error.message);
    }

    // Test 2: Admin Suspicious API
    console.log('\nTest 2: GET /api/admin/suspicious...');
    try {
        const suspiciousResponse = await makeRequest('GET', '/api/admin/suspicious');

        assert(
            suspiciousResponse.status === 200,
            'Admin Suspicious API - Status Code',
            `Expected 200, got ${suspiciousResponse.status}`
        );

        assert(
            Array.isArray(suspiciousResponse.data.scans),
            'Admin Suspicious API - Scans Array',
            'Expected scans to be an array'
        );

        assert(
            Array.isArray(suspiciousResponse.data.top_risky_shops),
            'Admin Suspicious API - Risky Shops Array',
            'Expected top_risky_shops to be an array'
        );

        console.log(`   ✓ Suspicious scans: ${suspiciousResponse.data.total_suspicious}`);
        console.log(`   ✓ Risky shops: ${suspiciousResponse.data.top_risky_shops.length}`);

    } catch (error) {
        assert(false, 'Admin Suspicious API - Request', error.message);
    }

    // Test 3: Register Business
    console.log('\nTest 3: POST /api/businesses...');
    try {
        const businessData = {
            legalName: 'Test Business Ltd',
            tradeName: 'Test Shop',
            type: 'Private Limited',
            category: 'Retail',
            address: 'Test Address, Chennai',
            latitude: 13.0827,
            longitude: 80.2707,
            gstNumber: 'TEST123456789'
        };

        const registerResponse = await makeRequest('POST', '/api/businesses', businessData);

        assert(
            registerResponse.status === 200 || registerResponse.status === 201,
            'Business Registration - Status Code',
            `Expected 200/201, got ${registerResponse.status}`
        );

        assert(
            registerResponse.data.id !== undefined,
            'Business Registration - ID Generated',
            'No business ID returned'
        );

        const businessId = registerResponse.data.id;
        console.log(`   ✓ Business ID: ${businessId}`);

        // Test 4: Generate QR Token
        console.log('\nTest 4: GET /api/qr-token/:id...');
        const qrResponse = await makeRequest('GET', `/api/qr-token/${businessId}`);

        assert(
            qrResponse.status === 200,
            'QR Token Generation - Status Code',
            `Expected 200, got ${qrResponse.status}`
        );

        assert(
            qrResponse.data.token !== undefined,
            'QR Token Generation - Token Created',
            'No token returned'
        );

        const token = qrResponse.data.token;
        console.log(`   ✓ Token generated (${token.substring(0, 30)}...)`);

        // Test 5: Valid Scan
        console.log('\nTest 5: POST /api/verify-scan (valid)...');
        const validScanData = {
            token: token,
            scannerLocation: {
                lat: 13.0827,
                lng: 80.2707
            }
        };

        const validScanResponse = await makeRequest('POST', '/api/verify-scan', validScanData);

        assert(
            validScanResponse.data.status === 'VALID',
            'Valid Scan - Verification',
            `Expected VALID, got ${validScanResponse.data.status}`
        );

        console.log(`   ✓ Result: ${validScanResponse.data.status}`);

        // Test 6: Location Mismatch Scan
        console.log('\nTest 6: POST /api/verify-scan (location mismatch)...');
        const mismatchScanData = {
            token: token,
            scannerLocation: {
                lat: 13.1050,  // ~2.5km away
                lng: 80.2900
            }
        };

        const mismatchResponse = await makeRequest('POST', '/api/verify-scan', mismatchScanData);

        assert(
            mismatchResponse.data.status === 'LOCATION_MISMATCH',
            'Location Mismatch - Detection',
            `Expected LOCATION_MISMATCH, got ${mismatchResponse.data.status}`
        );

        if (mismatchResponse.data.distance) {
            console.log(`   ✓ Distance: ${mismatchResponse.data.distance.toFixed(2)}km`);
        }

        // Test 7: Verify Scans Were Logged
        console.log('\nTest 7: Verify scans were logged...');
        const verifyShopsResponse = await makeRequest('GET', '/api/admin/shops');

        let testBusinessFound = false;
        let testBusinessScans = 0;

        for (const shop of verifyShopsResponse.data.shops) {
            if (shop.name === 'Test Shop') {
                testBusinessFound = true;
                testBusinessScans = shop.total_scans;
                break;
            }
        }

        assert(
            testBusinessFound,
            'Scan Logging - Business Found',
            'Test business not found in shops list'
        );

        assert(
            testBusinessScans >= 2,
            'Scan Logging - Scans Recorded',
            `Expected at least 2 scans, found ${testBusinessScans}`
        );

        console.log(`   ✓ Scans recorded: ${testBusinessScans}`);

    } catch (error) {
        assert(false, 'Business/QR/Scan Flow - Request', error.message);
    }
}

// Main test runner
async function runTests() {
    console.log('═══════════════════════════════════════════════════');
    console.log('   TN-MBNR Backend API Test Suite');
    console.log('═══════════════════════════════════════════════════');
    console.log(`   Testing against: ${BASE_URL}`);
    console.log('═══════════════════════════════════════════════════\n');

    try {
        // Check if server is running
        console.log('Checking server availability...');
        const healthCheck = await makeRequest('GET', '/api/businesses');
        console.log('✅ Server is running\n');

        // Run tests
        await testAPIs();

        // Print results
        console.log('\n\n═══════════════════════════════════════════════════');
        console.log('   TEST RESULTS');
        console.log('═══════════════════════════════════════════════════\n');

        testResults.forEach(result => console.log(result));

        console.log('\n═══════════════════════════════════════════════════');
        console.log(`   Total Tests: ${passedTests + failedTests}`);
        console.log(`   ✅ Passed: ${passedTests}`);
        console.log(`   ❌ Failed: ${failedTests}`);
        console.log('═══════════════════════════════════════════════════\n');

        if (failedTests === 0) {
            console.log('🎉 ALL TESTS PASSED! 🎉\n');
            process.exit(0);
        } else {
            console.log('⚠️  SOME TESTS FAILED ⚠️\n');
            process.exit(1);
        }

    } catch (error) {
        console.error('\n❌ TEST SUITE ERROR:', error.message);
        console.error('\nPlease ensure:');
        console.error('1. Backend server is running (npm run server)');
        console.error('2. Server is accessible on http://localhost:3001');
        console.error('3. Database is properly initialized\n');
        process.exit(1);
    }
}

// Run tests
runTests();
