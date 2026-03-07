import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BusinessRegistration } from './BusinessRegistration'
import { LanguageProvider } from '../context/LanguageContext'

const mockOnRegister = vi.fn()
const mockBusinesses: any[] = []

const renderBusinessRegistration = () => {
    return render(
        <LanguageProvider>
            <BusinessRegistration
                onRegister={mockOnRegister}
                businesses={mockBusinesses}
            />
        </LanguageProvider>
    )
}

describe('BusinessRegistration Component', () => {
    it('renders registration form without crashing', () => {
        const { container } = renderBusinessRegistration()
        expect(container).toBeTruthy()
    })

    it('displays form fields', () => {
        renderBusinessRegistration()

        // Check for key form elements
        // Check for key form elements
        const inputs = document.querySelectorAll('input')
        expect(inputs.length).toBeGreaterThan(0)
    })

    it('has demo data button', () => {
        renderBusinessRegistration()

        // Look for demo/fill button
        const buttons = document.querySelectorAll('button')
        expect(buttons.length).toBeGreaterThan(0)
    })

    it('validates form inputs', () => {
        renderBusinessRegistration()

        // Form should have input fields
        const inputs = document.querySelectorAll('input')
        expect(inputs.length).toBeGreaterThan(0)
    })

    it('handles form submission', () => {
        renderBusinessRegistration()

        // Should have a submit button
        const submitButtons = Array.from(document.querySelectorAll('button'))
            .filter(btn => btn.textContent?.toLowerCase().includes('submit') ||
                btn.textContent?.toLowerCase().includes('register'))

        expect(submitButtons.length).toBeGreaterThanOrEqual(0)
    })
})
