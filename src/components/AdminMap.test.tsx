import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AdminMap } from './AdminMap'

const mockShops = [
    {
        id: 'TEST-001',
        name: 'Test Shop',
        lat: 13.0827,
        lng: 80.2707,
        total_scans: 10,
        failed_scans: 2,
        verified_scans: 8
    }
]

const mockSuspiciousScans = [
    {
        id: 1,
        shop_name: 'Test Shop',
        shop_location: { lat: 13.0827, lng: 80.2707 },
        lat: 13.0827,
        lng: 80.2707,
        scan_location: { lat: 13.1000, lng: 80.3000 },
        distance: 5.2,
        result: 'LOCATION_MISMATCH',
        scanned_at: '2024-01-01T10:00:00Z'
    }
]

// Mock Leaflet
vi.mock('react-leaflet', () => ({
    MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: () => <div data-testid="marker" />,
    Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
    useMap: () => ({
        setView: vi.fn(),
        fitBounds: vi.fn()
    })
}))

vi.mock('leaflet', () => {
    class IconMock {
        static Default = class {
            static mergeOptions = vi.fn();
            prototype: any = {};
        }
        constructor() { }
    }

    const L = {
        icon: vi.fn(() => ({})),
        Icon: IconMock,
        latLngBounds: vi.fn(() => ({
            extend: vi.fn(),
            isValid: vi.fn(() => true)
        }))
    }
    return {
        ...L,
        default: L
    }
})

const renderAdminMap = (shops = mockShops, suspiciousScans = mockSuspiciousScans) => {
    return render(
        <AdminMap shops={shops} suspiciousScans={suspiciousScans} />
    )
}

describe('AdminMap Component', () => {
    it('renders map without crashing', () => {
        const { container } = renderAdminMap()
        expect(container).toBeTruthy()
    })

    it('displays map container', () => {
        const { getByTestId } = renderAdminMap()
        expect(getByTestId('map-container')).toBeTruthy()
    })

    it('handles empty shops array', () => {
        const { container } = renderAdminMap([], [])
        expect(container).toBeTruthy()
    })

    it('renders with shop data', () => {
        const { container } = renderAdminMap(mockShops, mockSuspiciousScans)
        expect(container).toBeTruthy()
    })
})
