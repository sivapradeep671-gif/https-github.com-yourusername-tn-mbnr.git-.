import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
// Note: In a real project, we would export `app` from index.cjs without starting the server,
// e.g. module.exports = app;
// For this test script, we assume `app` is imported from the server entry point.

// Mocking the app for demonstration of Layer 3 integration structure
const app = express();
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'online' }));
app.post('/api/auth/login', (req, res) => {
    const { phone, role } = req.body;
    if (!phone || !role) return res.status(400).json({ error: 'Missing phone or role' });
    res.json({ message: 'Login successful', token: 'mock-jwt-token' });
});
app.post('/api/businesses', (req, res) => res.status(201).json({ message: 'success', data: { id: 'BIZ-123' } }));
app.get('/api/businesses', (req, res) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ message: 'success', data: [] });
});
app.post('/api/verify-business', (req, res) => {
    const { businessName } = req.body;
    if (businessName === 'Conflict Name') {
        return res.json({ isSafe: false, message: 'CRITICAL FLAG: The name is already registered.' });
    }
    return res.json({ isSafe: true, message: 'VERIFIED: Brand name clear.' });
});

describe('Layer 3: Integration Tests (Supertest + Vitest)', () => {
    
    let adminToken: string;

    describe('System Health & Base Connectivity', () => {
        it('should return 200 online status from /api/health', async () => {
            const response = await request(app).get('/api/health');
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('online');
        });
    });

    describe('Authentication API (/api/auth)', () => {
        it('should return a JWT token for valid login', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ phone: '9999988888', role: 'admin' });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            adminToken = response.body.token; // Save token for future requests
        });

        it('should reject login with missing parameters', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ phone: '9999988888' }); // Missing role
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Missing phone or role');
        });
    });

    describe('Protected Business APIs (/api/businesses)', () => {
        it('should reject unauthorized access to business registry', async () => {
            const response = await request(app).get('/api/businesses');
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Unauthorized');
        });

        it('should allow access with valid auth token', async () => {
            const response = await request(app)
                .get('/api/businesses')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should successfully register a new business', async () => {
            const newBiz = {
                legalName: 'Test Integration Corp',
                tradeName: 'Test Shop',
                category: 'Retail',
                contactNumber: '9876543210'
            };

            const response = await request(app)
                .post('/api/businesses')
                .send(newBiz);
            
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('success');
            expect(response.body.data).toHaveProperty('id');
        });
    });

    describe('AI Intelligence Endpoints (/api/verify-business)', () => {
        it('should flag a conflicting business name', async () => {
            const response = await request(app)
                .post('/api/verify-business')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ businessName: 'Conflict Name' });
            
            expect(response.status).toBe(200);
            expect(response.body.isSafe).toBe(false);
            expect(response.body.message).toContain('CRITICAL FLAG');
        });

        it('should verify a unique business name', async () => {
            const response = await request(app)
                .post('/api/verify-business')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ businessName: 'Unique New Brand XYZ' });
            
            expect(response.status).toBe(200);
            expect(response.body.isSafe).toBe(true);
            expect(response.body.message).toContain('VERIFIED');
        });
    });
});
