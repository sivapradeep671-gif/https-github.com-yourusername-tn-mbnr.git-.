import { describe, it, expect } from 'vitest'
import { generateMockToken, verifyMockToken } from '../utils/mockQR'

describe('Mock QR Token Utils', () => {
    it('generates a valid mock token', () => {
        const businessId = 'TEST-001'

        const token = generateMockToken(businessId)

        expect(token).toBeTruthy()
        expect(typeof token).toBe('string')
    })

    it('verifies a valid mock token at correct location', () => {
        const businessId = 'TEST-001'
        const location = { lat: 13.0827, lng: 80.2707 } // Same as mock business location

        const token = generateMockToken(businessId)
        const result = verifyMockToken(token, location)

        expect(result).toBeTruthy()
        expect(result.status).toBe('VALID')
    })

    it('rejects token with wrong location', () => {
        const businessId = 'TEST-001'
        const wrongLocation = { lat: 12.0000, lng: 79.0000 }

        const token = generateMockToken(businessId)
        const result = verifyMockToken(token, wrongLocation)

        expect(result.status).toBe('LOCATION_MISMATCH')
    })
})
