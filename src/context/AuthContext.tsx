import { createContext, useContext, useState, type ReactNode } from 'react';
import { generateId } from '../utils/generateId';

export type UserRole = 'admin' | 'business' | 'citizen';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    businessId?: string;
    businessName?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserRole) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (email: string, role: UserRole) => {
        // Mock Login Logic
        const newUser: User = {
            id: generateId(),
            name: email.split('@')[0],
            email,
            role,
            businessId: role === 'business' ? 'demo-biz-123' : undefined
        };
        setUser(newUser);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
