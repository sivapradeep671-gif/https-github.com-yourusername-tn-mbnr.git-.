import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './Navbar'
import { AuthProvider } from '../context/AuthContext'
import { LanguageProvider } from '../context/LanguageContext'

// Helper to render Navbar with all required providers
const renderNavbar = (currentView = 'HOME') => {
    const setCurrentView = vi.fn()

    return {
        ...render(
            <BrowserRouter>
                <LanguageProvider>
                    <AuthProvider>
                        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
                    </AuthProvider>
                </LanguageProvider>
            </BrowserRouter>
        ),
        setCurrentView
    }
}

describe('Navbar Component', () => {
    describe('Rendering', () => {
        it('renders navbar with logo and brand name', () => {
            renderNavbar()

            expect(screen.getByText('TN-MBNR')).toBeInTheDocument()
            expect(screen.getByText('TRUSTREG TN PILOT')).toBeInTheDocument()
        })

        it('renders navigation menu items', () => {
            renderNavbar()

            // Check for common nav items (visible when not authenticated)
            expect(screen.getByText(/home/i)).toBeInTheDocument()
            expect(screen.getByText(/scan/i)).toBeInTheDocument()
        })

        it('renders login button when not authenticated', () => {
            renderNavbar()

            expect(screen.getByText('Login')).toBeInTheDocument()
        })
    })

    describe('Language Switcher', () => {
        it('renders language toggle button', () => {
            renderNavbar()

            const languageButtons = screen.getAllByRole('button', { name: /switch to/i })
            expect(languageButtons.length).toBeGreaterThan(0)
        })
    })

    describe('Mobile Menu', () => {
        it('renders mobile menu toggle button', () => {
            renderNavbar()

            // Mobile menu button should be present
            const menuButtons = screen.getAllByRole('button')
            expect(menuButtons.length).toBeGreaterThan(0)
        })
    })

    describe('Navigation', () => {
        it('calls setCurrentView when nav item is clicked', () => {
            const { setCurrentView } = renderNavbar()

            const homeButton = screen.getByText(/home/i)
            fireEvent.click(homeButton)

            expect(setCurrentView).toHaveBeenCalled()
        })
    })

    describe('Sync Status Indicator', () => {
        it('displays sync status indicator', () => {
            renderNavbar()

            expect(screen.getByText(/sync: ok/i)).toBeInTheDocument()
        })
    })
})
