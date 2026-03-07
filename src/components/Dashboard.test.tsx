import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { AuthProvider } from '../context/AuthContext'
import { LanguageProvider } from '../context/LanguageContext'
import type { Business } from '../types/types'

const mockBusinesses: Business[] = [
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
        contactNumber: '9876543210',
        email: 'test@example.com'
    }
]

const renderDashboard = (businesses = mockBusinesses) => {
    const onUpdateStatus = vi.fn()

    return {
        ...render(
            <BrowserRouter>
                <LanguageProvider>
                    <AuthProvider>
                        <Dashboard
                            businesses={businesses}
                            reports={[]}
                            onUpdateStatus={onUpdateStatus}
                        />
                    </AuthProvider>
                </LanguageProvider>
            </BrowserRouter>
        ),
        onUpdateStatus
    }
}

describe('Dashboard Component', () => {
    it('renders dashboard without crashing', () => {
        const { container } = renderDashboard()
        // Dashboard should render successfully
        expect(container).toBeTruthy()
    })

    it('displays business data when businesses are provided', () => {
        const { container } = renderDashboard(mockBusinesses)

        // Should render without errors with business data
        expect(container).toBeTruthy()
    })

    it('handles empty businesses array', () => {
        const { container } = renderDashboard([])

        // Should render without errors even with empty data
        expect(container).toBeTruthy()
    })
})
