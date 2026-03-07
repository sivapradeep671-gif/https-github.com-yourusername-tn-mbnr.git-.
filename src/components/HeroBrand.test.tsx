import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Hero } from '../components/HeroBrand'
import { LanguageProvider } from '../context/LanguageContext'

describe('Hero Component', () => {
    const mockProps = {
        onRegister: () => { },
        onScan: () => { },
        onCitizenRegister: () => { },
    }

    it('renders hero component without crashing', () => {
        render(
            <BrowserRouter>
                <LanguageProvider>
                    <Hero {...mockProps} />
                </LanguageProvider>
            </BrowserRouter>
        )

        expect(screen.getByText(/TN-MBNR/i)).toBeInTheDocument()
    })

    it('displays main heading', () => {
        render(
            <BrowserRouter>
                <LanguageProvider>
                    <Hero {...mockProps} />
                </LanguageProvider>
            </BrowserRouter>
        )

        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
    })
})
