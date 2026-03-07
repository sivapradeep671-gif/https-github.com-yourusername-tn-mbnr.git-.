import { describe, it, expect } from 'vitest'
import { generateId } from './generateId'

describe('generateId Utility', () => {
    it('generates a non-empty string', () => {
        const id = generateId()

        expect(id).toBeTruthy()
        expect(typeof id).toBe('string')
        expect(id.length).toBeGreaterThan(0)
    })

    it('generates unique IDs', () => {
        const id1 = generateId()
        const id2 = generateId()

        expect(id1).not.toBe(id2)
    })

    it('generates IDs with expected format', () => {
        const id = generateId()

        // Should be a string with reasonable length
        expect(id.length).toBeGreaterThan(5)
        expect(id.length).toBeLessThan(50)
    })

    it('generates multiple unique IDs in sequence', () => {
        const ids = new Set()

        for (let i = 0; i < 100; i++) {
            ids.add(generateId())
        }

        // All 100 IDs should be unique
        expect(ids.size).toBe(100)
    })
})
