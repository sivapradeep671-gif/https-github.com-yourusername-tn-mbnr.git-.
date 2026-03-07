
const { spawn } = require('child_process');

const tests = [
    'src/components/BusinessRegistrationInputVerification.test.tsx',
    'src/components/CoreWorkflowsVerification.test.tsx',
    'src/components/WorkflowIntegration.test.tsx'
];

console.log('Starting System Verification...');
console.log('--------------------------------');

// Helper to run a single test command
const runTest = (testFile) => {
    return new Promise((resolve) => {
        console.log(`\n> Verifying: ${testFile.split('/').pop()}`);
        const child = spawn('npx', ['vitest', 'run', testFile, '--reporter=verbose'], {
            shell: true,
            cwd: process.cwd(),
            env: { ...process.env, CI: 'true' } // Force CI mode to avoid watch
        });

        let output = '';
        let passed = false;

        child.stdout.on('data', d => {
            process.stdout.write(d); // Stream to console
            output += d.toString();
        });
        child.stderr.on('data', d => {
            process.stderr.write(d);
        });

        child.on('close', (code) => {
            if (code === 0) passed = true;
            resolve(passed);
        });
    });
};

const runAll = async () => {
    let allPassed = true;
    for (const test of tests) {
        const result = await runTest(test);
        if (!result) allPassed = false;
    }

    console.log('\n--------------------------------');
    if (allPassed) {
        console.log('✅ SYSTEM VERIFICATION COMPLETED: ALL COMPLIANT');
    } else {
        console.log('❌ SYSTEM VERIFICATION FAILED: CHECK LOGS');
        process.exit(1);
    }
};

runAll();
