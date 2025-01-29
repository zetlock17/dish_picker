import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.scss';
import AppHeader from './components/AppHeader';
import MainPage from './components/MainPage';
import AccountPage from './components/AccountPage';
import DishPage from './components/DishPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

const AppContent: React.FC = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!isAuthPage && <AppHeader />}
            <Routes>
                <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
                <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
                <Route path="/dish/:id" element={<PrivateRoute><DishPage /></PrivateRoute>} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;