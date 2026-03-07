import { describe, it, expect } from 'vitest'
import { getDistanceFromLatLonInKm, signData } from './mockQR'

describe('Distance Calculation', () => {
    it('calculates distance between two points correctly', () => {
        // Chennai to Madurai (approximately 460 km)
        const chennai = { lat: 13.0827, lng: 80.2707 }
        const madurai = { lat: 9.9252, lng: 78.1198 }

        const distance = getDistanceFromLatLonInKm(
            chennai.lat, chennai.lng,
            madurai.lat, madurai.lng
        )

        // Distance should be approximately 460 km (allow 10% margin)
        expect(distance).toBeGreaterThan(400)
        expect(distance).toBeLessThan(500)
    })

    it('returns zero for same location', () => {
        const location = { lat: 13.0827, lng: 80.2707 }

        const distance = getDistanceFromLatLonInKm(
            location.lat, location.lng,
            location.lat, location.lng
        )

        expect(distance).toBe(0)
    })

    it('calculates small distances accurately', () => {
        // Two points 200m apart (approximately)
        const point1 = { lat: 13.0827, lng: 80.2707 }
        const point2 = { lat: 13.0845, lng: 80.2707 }

        const distance = getDistanceFromLatLonInKm(
            point1.lat, point1.lng,
            point2.lat, point2.lng
        )

        // Should be around 0.2 km (200m)
        expect(distance).toBeGreaterThan(0.1)
        expect(distance).toBeLessThan(0.3)
    })
})

describe('Data Signing', () => {
    it('generates a signature for data', () => {
        const data = { id: 'TEST-001', name: 'Test Business' }
        const signature = signData(data)

        expect(signature).toBeTruthy()
        expect(typeof signature).toBe('string')
        expect(signature.length).toBeGreaterThan(0)
    })

    it('generates consistent signatures for same data', () => {
        const data = { id: 'TEST-001', name: 'Test Business' }

        const signature1 = signData(data)
        const signature2 = signData(data)

        expect(signature1).toBe(signature2)
    })

    it('generates different signatures for different data', () => {
        const data1 = { id: 'TEST-001', name: 'Business A' }
        const data2 = { id: 'TEST-002', name: 'Business B' }

        const signature1 = signData(data1)
        const signature2 = signData(data2)

        expect(signature1).not.toBe(signature2)
    })

    it('generates hex string signature', () => {
        const data = { id: 'TEST-001' }
        const signature = signData(data)

        // Should be a hex string (only 0-9, a-f characters)
        expect(signature).toMatch(/^[0-9a-f]+$/)
    })
})
