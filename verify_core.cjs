
const { spawn } = require('child_process');

console.log('Running tests...');
const child = spawn('npx', ['vitest', 'run', 'src/components/WorkflowIntegration.test.tsx', '--reporter=json'], {
    shell: true,
    cwd: process.cwd()
});

let output = '';

child.stdout.on('data', (data) => {
    output += data.toString();
});

child.stderr.on('data', (data) => {
    // console.error(`stderr: ${data}`); // Suppress stderr to avoid noise
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    try {
        const jsonStart = output.indexOf('{');
        const jsonEnd = output.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonStr = output.substring(jsonStart, jsonEnd + 1);
            const result = JSON.parse(jsonStr);
            console.log('--- TEST RESULTS ---');
            console.log(`Total: ${result.numTotalTests}, Passed: ${result.numPassedTests}, Failed: ${result.numFailedTests}`);
            if (result.testResults && result.testResults.length > 0) {
                const suite = result.testResults[0];
                suite.assertionResults.forEach(assertion => {
                    if (assertion.status !== 'passed') {
                        console.log(`[FAILED] ${assertion.title}`);
                        console.log(`  Error: ${assertion.failureMessages.join('\n')}`);
                    } else {
                        console.log(`[PASSED] ${assertion.title}`);
                    }
                });
            }
        } else {
            console.log('Could not find JSON output');
        }
    } catch (e) {
        console.error('Error parsing JSON:', e);
    }
});
