import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AccountPageProps {}

const AccountPage: React.FC<AccountPageProps> = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const storedUsername = localStorage.getItem('username');

    if (!storedUsername) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <h2>Информация об аккаунте</h2>
            <p>Имя пользователя: {storedUsername}</p>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default AccountPage;