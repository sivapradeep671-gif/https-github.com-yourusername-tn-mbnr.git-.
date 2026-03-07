import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { QRScanner } from './QRScanner'
import { LanguageProvider } from '../context/LanguageContext'

const mockBusinesses = [
    {
        id: 'TEST-001',
        legalName: 'Test Business Ltd',
        tradeName: 'Test Shop',
        type: 'Private Limited',
        category: 'Retail',
        address: '123 Test St',
        latitude: 13.0827,
        longitude: 80.2707,
        status: 'Verified',
        gstNumber: '33AABCT1234F1Z5',
        registrationDate: '2024-01-01',
        contactNumber: '1234567890',
        email: 'test@example.com'
    } as const
]

// Mock the Html5QrcodeScanner
vi.mock('html5-qrcode', () => ({
    Html5QrcodeScanner: vi.fn().mockImplementation(() => ({
        render: vi.fn(),
        clear: vi.fn().mockResolvedValue(undefined)
    }))
}))

// Mock voice utils
vi.mock('../utils/voiceUtils', () => ({
    announceStatus: vi.fn()
}))

const renderQRScanner = (businesses = mockBusinesses) => {
    return render(
        <LanguageProvider>
            <QRScanner businesses={businesses} />
        </LanguageProvider>
    )
}

describe('QRScanner Component', () => {
    it('renders QR scanner without crashing', () => {
        const { container } = renderQRScanner()
        expect(container).toBeTruthy()
    })

    it('displays scanner container', () => {
        renderQRScanner()
        // QR scanner should have a reader element
        const reader = document.getElementById('reader')
        expect(reader).toBeTruthy()
    })

    it('handles empty businesses array', () => {
        renderQRScanner([])
        // Should not crash even with empty list
        const reader = document.getElementById('reader')
        expect(reader).toBeTruthy()
    })

    it('initializes with no scan result', () => {
        renderQRScanner()
        // Initially, no result should be displayed
        const container = document.querySelector('.scan-result')
        expect(container).toBeFalsy()
    })
})
