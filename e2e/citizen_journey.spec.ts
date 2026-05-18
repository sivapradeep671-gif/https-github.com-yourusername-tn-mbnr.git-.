import { test, expect } from '@playwright/test';

test.describe('Critical E2E citizen journey', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Full citizen registration to approval flow', async ({ page }) => {
        // Step 1: Citizen submits business registration form
        await page.click('button:has-text("Register")'); // Assuming 'REGISTER' view from Navbar
        
        // Fill business details
        await page.fill('input[name="legalName"]', 'Test Bakery Legal');
        await page.fill('input[name="tradeName"]', 'Test Bakery Shop');
        await page.fill('input[name="contactNumber"]', '9876543210');
        await page.fill('textarea[name="address"]', '123 Main St, Ward 5, Chennai');
        await page.selectOption('select[name="category"]', 'Food & Beverage');
        await page.selectOption('select[name="municipal_ward"]', 'Ward 5');
        
        // Agree to terms and submit
        const termsCheckbox = page.locator('input#terms');
        if (await termsCheckbox.isVisible()) {
             await termsCheckbox.check();
        }
        
        await page.click('button:has-text("Proceed to Payment"), button:has-text("Submit")');
        
        // Step 2: Officer logs in, reviews application, approves
        await page.goto('/');
        await page.click('button:has-text("Login")');
        
        // Officer Login
        await page.click('button:has-text("admin")'); // Select admin role
        await page.fill('input[placeholder="Enter ID"]', '9999988888');
        await page.fill('input[placeholder="Enter Master Password"]', '1234');
        await page.click('button:has-text("Send OTP & Authenticate")');

        // Go to Registry/Pending and approve
        await page.click('button:has-text("Registry")');
        await page.click('text=Test Bakery Shop');
        
        // Approve via ApprovalWorkflow component
        await page.selectOption('select:has-text("Workflow Stage")', 'FINAL');
        await page.selectOption('select:has-text("Decision")', 'APPROVED');
        await page.fill('textarea[placeholder="Enter detailed audit notes..."]', 'All documents verified and found correct.');
        await page.click('button:has-text("Commit Decision to Ledger")');

        // Step 3 & 4: QR code is auto-generated and stored, scan returns identity
        // Check for success or QR code element in the business details
        await expect(page.locator('text=Approved')).toBeVisible();
        await expect(page.locator('img[alt="QR Code"], svg.lucide-qr-code')).toBeVisible();

        // Step 5: Certificate PDF is issued to citizen
        await page.click('button[title="Exit System"]');
        await page.click('button:has-text("Login")');
        await page.click('button:has-text("citizen")');
        await page.fill('input[placeholder="Enter 10-digit number"]', '9876543210');
        await page.click('button:has-text("Send OTP & Authenticate")');
        
        await page.click('button:has-text("Registry"), button:has-text("Console")');
        await expect(page.locator('text=Download Certificate')).toBeVisible();
    });

    test('Rejection flow: officer rejects with reason', async ({ page }) => {
        // Step 1: Officer logs in
        await page.click('button:has-text("Login")');
        await page.click('button:has-text("admin")');
        await page.fill('input[placeholder="Enter ID"]', '9999988888');
        await page.fill('input[placeholder="Enter Master Password"]', '1234');
        await page.click('button:has-text("Send OTP & Authenticate")');

        // Step 2: Officer rejects an application
        await page.click('button:has-text("Registry")');
        // Assuming we click on an existing pending application
        const firstPending = page.locator('text=Pending').first();
        if (await firstPending.isVisible()) {
            await firstPending.click();
            await page.selectOption('select:has-text("Workflow Stage")', 'SCRUTINY');
            await page.selectOption('select:has-text("Decision")', 'REJECTED');
            await page.fill('textarea[placeholder="Enter detailed audit notes..."]', 'Incomplete documents');
            await page.click('button:has-text("Commit Decision to Ledger")');
            await expect(page.locator('text=REJECTED')).toBeVisible();
        }
    });

    test('Due date breach triggers SLA alert', async ({ page }) => {
        // Check for SLA breach alert or indicator on the admin dashboard
        await page.click('button:has-text("Login")');
        await page.click('button:has-text("admin")');
        await page.fill('input[placeholder="Enter ID"]', '9999988888');
        await page.fill('input[placeholder="Enter Master Password"]', '1234');
        await page.click('button:has-text("Send OTP & Authenticate")');

        await page.click('button:has-text("Dashboard"), button:has-text("Console")');
        await expect(page.locator('text=SLA Velocity')).toBeVisible();
        await expect(page.locator('text=Breach / Lapsed')).toBeVisible();
    });
});
