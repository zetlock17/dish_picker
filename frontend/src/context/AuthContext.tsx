import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isAuth: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean>(() => {
        const storedIsAuth = localStorage.getItem('isAuth');
        return storedIsAuth === 'true';
    });

    const login = async (username: string, password: string): Promise<boolean> => {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.isAuth) {
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('username', data.username);
            setIsAuth(true);
            return true;
        } else {
            localStorage.setItem('isAuth', 'false');
            setIsAuth(false);
            return false;
        }
    };

    const logout = () => {
        localStorage.setItem('isAuth', 'false');
        localStorage.removeItem('username');
        setIsAuth(false);
    };

    return (
        <AuthContext.Provider value={{ isAuth, login, logout }}>
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