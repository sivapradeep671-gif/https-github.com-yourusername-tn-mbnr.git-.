import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BusinessRegistration } from './BusinessRegistration'
import { LanguageProvider } from '../context/LanguageContext'

// Mock Translations to ensure we are testing against expected keys
// In a real scenario, we might want to test with actual translations, but for logic verification, this is safer.
// However, since we import LanguageContext which uses actual translations, we should use the actual expected labels generally
// or rely on placeholders/test-ids if labels are dynamic. 
// For this test, we will assume English defaults from translations.ts

const mockOnRegister = vi.fn()
const mockBusinesses: any[] = []

const renderComponent = () => {
    return render(
        <LanguageProvider>
            <BusinessRegistration onRegister={mockOnRegister} businesses={mockBusinesses} />
        </LanguageProvider>
    )
}

describe('BusinessRegistration Input Field Verification', () => {

    it('verifies Legal Name field interaction', () => {
        const { container, debug } = renderComponent()
        debug() // Print HTML to console
        const input = container.querySelector('input[name="legalName"]')
        expect(input).not.toBeNull()
        expect(input).toBeInTheDocument()
        fireEvent.change(input!, { target: { value: 'Test Legal Name' } })
        expect(input).toHaveValue('Test Legal Name')
    })

    it('verifies Trade Name field interaction', () => {
        const { container } = renderComponent()
        const input = container.querySelector('input[name="tradeName"]')
        expect(input).toBeInTheDocument()
        fireEvent.change(input!, { target: { value: 'Test Trade Name' } })
        expect(input).toHaveValue('Test Trade Name')
    })

    it('verifies Business Type select interaction', () => {
        const { container } = renderComponent()
        const select = container.querySelector('select[name="type"]')
        expect(select).toBeInTheDocument()
        fireEvent.change(select!, { target: { value: 'Partnership' } })
        expect(select).toHaveValue('Partnership')
    })

    it('verifies Business Category select interaction', () => {
        const { container, debug } = renderComponent()
        debug()
        const select = container.querySelector('select[name="category"]')
        expect(select).not.toBeNull()
        expect(select).toBeInTheDocument()
        fireEvent.change(select!, { target: { value: 'Retail' } })
        expect(select).toHaveValue('Retail')
    })

    it('verifies GST Number field interaction', () => {
        const { container } = renderComponent()
        const input = container.querySelector('input[name="gstNumber"]')
        expect(input).toBeInTheDocument()
        fireEvent.change(input!, { target: { value: '33ABCDE1234F1Z5' } })
        expect(input).toHaveValue('33ABCDE1234F1Z5')
    })

    it('verifies Address field interaction', () => {
        const { container } = renderComponent()
        // Address is a textarea in the component?
        // Let's check: type="textarea" passed to InputField.
        // InputField renders textarea if type is textarea.
        const input = container.querySelector('textarea[name="address"]')
        expect(input).toBeInTheDocument()
        fireEvent.change(input!, { target: { value: '123 Test Street, Chennai' } })
        expect(input).toHaveValue('123 Test Street, Chennai')
    })

    it('verifies Branch Name field interaction', () => {
        const { container } = renderComponent()
        const input = container.querySelector('input[name="branchName"]')
        expect(input).toBeInTheDocument()
        fireEvent.change(input!, { target: { value: 'Test Branch' } })
        expect(input).toHaveValue('Test Branch')
    })

    it('verifies Contact Number field interaction', () => {
        const { container } = renderComponent()
        const input = container.querySelector('input[name="contactNumber"]')
        expect(input).toBeInTheDocument()
        fireEvent.change(input!, { target: { value: '9876543210' } })
        expect(input).toHaveValue('9876543210')
    })

    it('verifies Property Tax Assessment No. field interaction', () => {
        const { container } = renderComponent()
        const input = container.querySelector('input[name="assessment_number"]')
        expect(input).toBeInTheDocument()
        fireEvent.change(input!, { target: { value: 'CHN-TEST-123' } })
        expect(input).toHaveValue('CHN-TEST-123')
    })

    it('verifies Water Tax connection No. field interaction', () => {
        const { container } = renderComponent()
        const input = container.querySelector('input[name="water_connection_no"]')
        expect(input).toBeInTheDocument()
        fireEvent.change(input!, { target: { value: 'W-TEST-456' } })
        expect(input).toHaveValue('W-TEST-456')
    })

    it('verifies Website URL field interaction', () => {
        const { container } = renderComponent()
        const input = container.querySelector('input[name="website"]')
        expect(input).toBeInTheDocument()
        fireEvent.change(input!, { target: { value: 'https://myshop.com' } })
        expect(input).toHaveValue('https://myshop.com')
    })

    it('verifies Logo Upload interaction', () => {
        const { container } = renderComponent()
        // Find the file input. It doesn't have a name attribute in the component snippet I saw, 
        // but it is the only type="file" input.
        const input = container.querySelector('input[type="file"]')
        expect(input).toBeInTheDocument()

        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })

        fireEvent.change(input!, { target: { files: [file] } })

        // Assert that the file name is displayed. 
        // The component displays {logoFile ? logoFile.name : ...}
        // So we should find text "chucknorris.png" in the document.
        const fileNameDisplay = screen.getByText('chucknorris.png')
        expect(fileNameDisplay).toBeInTheDocument()
    })
})
