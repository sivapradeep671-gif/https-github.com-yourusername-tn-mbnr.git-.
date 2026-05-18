import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CitizenRegistration } from './CitizenRegistration';
import { LanguageProvider } from '../context/LanguageContext';

// Wrap component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <LanguageProvider>
            {ui}
        </LanguageProvider>
    );
};

describe('Layer 2: Component Tests - CitizenRegistration', () => {
    it('renders the initial step correctly', () => {
        renderWithProviders(<CitizenRegistration onComplete={vi.fn()} />);
        
        // Verify Title and Subtitle are present (using regex for partial match based on translation)
        expect(screen.getByText(/Register/i)).toBeDefined();
        
        // Verify the initiate button is visible
        const initiateBtn = screen.getByRole('button');
        expect(initiateBtn).toBeDefined();
        expect(initiateBtn.textContent).toMatch(/Initiate/i);
    });

    it('progresses to step 2 when initiate button is clicked', async () => {
        renderWithProviders(<CitizenRegistration onComplete={vi.fn()} />);
        
        const initiateBtn = screen.getByRole('button');
        fireEvent.click(initiateBtn);
        
        // Wait for the form to appear
        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: /aadhaar/i })).toBeDefined();
            expect(screen.getByRole('textbox', { name: /mobile/i })).toBeDefined();
        });
    });

    it('handles form submission and shows loading state', async () => {
        renderWithProviders(<CitizenRegistration onComplete={vi.fn()} />);
        
        // Go to step 2
        fireEvent.click(screen.getByRole('button'));
        
        // Fill form
        const aadhaarInput = screen.getByRole('textbox', { name: /aadhaar/i });
        const mobileInput = screen.getByRole('textbox', { name: /mobile/i });
        
        fireEvent.change(aadhaarInput, { target: { value: '1234-5678-9012' } });
        fireEvent.change(mobileInput, { target: { value: '9876543210' } });
        
        // Submit
        const submitBtn = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitBtn);
        
        // Button should show verifying state
        expect(screen.getByText(/verifying/i)).toBeDefined();
        expect(submitBtn.hasAttribute('disabled')).toBe(true);
    });

    it('calls onComplete when the final step button is clicked', async () => {
        const mockOnComplete = vi.fn();
        renderWithProviders(<CitizenRegistration onComplete={mockOnComplete} />);
        
        // Go to step 2
        fireEvent.click(screen.getByRole('button'));
        
        // Submit step 2
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        
        // Wait for step 3 (simulating the 1500ms timeout)
        await waitFor(() => {
            expect(screen.getByText(/Success/i)).toBeDefined();
        }, { timeout: 2000 });
        
        // Click enter portal button
        const enterBtn = screen.getByRole('button', { name: /enter/i });
        fireEvent.click(enterBtn);
        
        // Assert callback was fired
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
});
