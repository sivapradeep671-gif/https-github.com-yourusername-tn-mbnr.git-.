const fs = require('fs');
const path = require('path');

// Mock FormData and fetch for Node environment testing
// In a real e2e test we'd use Playwright/Cypress, but here we test the API directly

async function testReportSubmission() {
    console.log("Starting Report Submission Test...");

    try {
        const boundary = '--------------------------' + Date.now().toString(16);

        // Create a dummy image file
        const imagePath = path.join(__dirname, 'test-image.jpg');
        fs.writeFileSync(imagePath, 'fake image content');

        // Construct multipart/form-data body manually for node-fetch (or native fetch in Node 18+)
        // Since we are running in a constrained env, we might not have 'form-data' package installed.
        // We will try to rely on the server being running and accessible.

        const formData = new FormData();
        formData.append('businessName', 'Test Business ' + Date.now());
        formData.append('location', 'Test Location');
        formData.append('description', 'Test Description');
        formData.append('category', 'Other');
        formData.append('severity', 'Low');

        // Read file and append
        const fileBuffer = fs.readFileSync(imagePath);
        const fileBlob = new Blob([fileBuffer], { type: 'image/jpeg' });
        formData.append('image', fileBlob, 'test-image.jpg');

        const response = await fetch('http://localhost:3001/api/reports', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Report Submitted Successfully!", data);

            if (data.image && data.image.includes('/uploads/report-')) {
                console.log("✅ Image path returned correctly:", data.image);
            } else {
                console.error("❌ Image path missing or incorrect:", data);
            }
        } else {
            console.error("❌ Failed to submit report:", await response.text());
        }

        // Cleanup
        fs.unlinkSync(imagePath);

    } catch (error) {
        console.error("❌ Test Error:", error);
    }
}

testReportSubmission();
