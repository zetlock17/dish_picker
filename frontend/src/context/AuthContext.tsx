import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const storedUser = localStorage.getItem('user');
        return !!storedUser;
    });

    const login = (username: string, password: string): boolean => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { username: storedUsername, password: storedPassword } = JSON.parse(storedUser);
            if (username === storedUsername && password === storedPassword) {
                setIsAuthenticated(true);
                return true;
            }
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};