import { describe, it, expect } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'
import { renderHook, act } from '@testing-library/react'

describe('AuthContext', () => {
    it('provides authentication state', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        )

        const { result } = renderHook(() => useAuth(), { wrapper })

        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBeNull()
    })

    it('allows user to login', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        )

        const { result } = renderHook(() => useAuth(), { wrapper })

        act(() => {
            result.current.login('test@example.com', 'citizen')
        })

        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user).toBeTruthy()
        expect(result.current.user?.email).toBe('test@example.com')
        expect(result.current.user?.role).toBe('citizen')
    })

    it('allows user to logout', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        )

        const { result } = renderHook(() => useAuth(), { wrapper })

        // Login first
        act(() => {
            result.current.login('test@example.com', 'business')
        })

        expect(result.current.isAuthenticated).toBe(true)

        // Then logout
        act(() => {
            result.current.logout()
        })

        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBeNull()
    })

    it('sets correct user role on login', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        )

        const { result } = renderHook(() => useAuth(), { wrapper })

        act(() => {
            result.current.login('admin@example.com', 'admin')
        })

        expect(result.current.user?.role).toBe('admin')
    })
})
