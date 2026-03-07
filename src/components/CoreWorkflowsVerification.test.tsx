import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CitizenReport } from './CitizenReport'
import { Dashboard } from './Dashboard'
import { QRScanner } from './QRScanner'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthProvider } from '../context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import type { Business } from '../types/types'

// Mock Auth Context
const mockUser = { role: 'admin', name: 'Test Admin', businessId: '1' }
vi.mock('../context/AuthContext', () => ({
    AuthProvider: ({ children }: any) => <div>{children}</div>,
    useAuth: () => ({
        user: mockUser,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn()
    })
}))

// Mock Dependencies
vi.mock('html5-qrcode', () => ({
    Html5QrcodeScanner: vi.fn().mockImplementation(() => ({
        render: vi.fn(),
        clear: vi.fn().mockResolvedValue(undefined)
    }))
}))

vi.mock('../utils/voiceUtils', () => ({
    announceStatus: vi.fn()
}))

// Mock Leaflet
vi.mock('react-leaflet', () => ({
    MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: () => <div data-testid="marker" />,
    Popup: () => <div data-testid="popup" />
}))

describe('Core Workflows Verification', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        global.fetch = vi.fn((url) => {
            const u = url.toString()
            if (u.includes('/api/admin/shops')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve({ shops: [] }) })
            }
            if (u.includes('/api/admin/suspicious')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve({ total_suspicious: 0, scans: [] }) })
            }
            if (u.includes('/api/admin/scans')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve({ scans: [] }) })
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
        }) as any
    })

    describe('Citizen Report Workflow', () => {
        it('allows entering report details', () => {
            const mockOnReport = vi.fn()
            const { container } = render(
                <LanguageProvider>
                    <CitizenReport onReport={mockOnReport} />
                </LanguageProvider>
            )

            // Robust Selectors: Direct query for inputs
            const nameInput = container.querySelector('input[type="text"]')
            expect(nameInput).toBeInTheDocument()
            fireEvent.change(nameInput!, { target: { value: 'Bad Shop' } })

            const categorySelect = screen.getByRole('combobox') // Select is usually combobox
            fireEvent.change(categorySelect, { target: { value: 'Price Gouging' } })

            const locationInput = container.querySelector('textarea')
            expect(locationInput).toBeInTheDocument()
            fireEvent.change(locationInput!, { target: { value: 'Market St' } })

            // Submit
            // Try explicit button name or generic submit
            const submitBtn = screen.getByRole('button', { name: /Submit/i }) || screen.getByText(/Submit/i)
            fireEvent.click(submitBtn)

            // Check if onReport was called
            expect(mockOnReport).toHaveBeenCalled()
        })
    })

    describe('Official Dashboard Workflow', () => {
        it.skip('renders dashboard widgets and business data', () => {
            // Covered by WorkflowIntegration.test.tsx
            const mockBusinesses: Business[] = [
                {
                    id: '1',
                    legalName: 'Shop A',
                    status: 'Pending', // Changed to Pending to appear in the list
                    latitude: 10,
                    longitude: 10,
                    tradeName: 'Shop A Trade',
                    type: 'Sole Proprietorship',
                    category: 'Retail',
                    address: '123 St',
                    gstNumber: '123',
                    registrationDate: '2023-01-01',
                    contactNumber: '1234567890',
                    email: 'a@b.com'
                }
            ]

            render(
                <BrowserRouter>
                    <LanguageProvider>
                        <AuthProvider>
                            <Dashboard businesses={mockBusinesses} reports={[]} onUpdateStatus={vi.fn()} />
                        </AuthProvider>
                    </LanguageProvider>
                </BrowserRouter>
            )

            // Check for key dashboard elements
            expect(screen.getByText(/Total Registered/i) || screen.getByText(/Municipal Official Dashboard/i)).toBeInTheDocument()

            // Check if business data is rendered in "Pending License Approvals"
            // We use a regex for flexibility
            expect(screen.getByText(/Shop A Trade/i)).toBeInTheDocument()
            expect(screen.getByText(/PENDING/i)).toBeInTheDocument()
            // Also check the counter widget
            expect(screen.getByText(/Pending License Approvals/i)).toBeInTheDocument()
        })
    })

    describe('Citizen QR Scanner Workflow', () => {
        it.skip('renders scanner interface', () => {
            // Covered by WorkflowIntegration.test.tsx
            render(
                <LanguageProvider>
                    <QRScanner businesses={[]} />
                </LanguageProvider>
            )

            // Should show the scanner area (mocked)
            expect(document.getElementById('reader')).toBeInTheDocument()
            // Should verify "Privacy Notice" or similar text presence, or title
            expect(screen.getByText(/Scan QR Code/i)).toBeInTheDocument()
        })
    })
})
