import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const validatePassword = (password: string): boolean => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(password);
    };

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Пароли не совпадают.');
            return;
        }

        if (!validatePassword(password)) {
            alert('Пароль должен содержать минимум 6 символов, включать английские буквы и цифры. Допускаются специальные символы.');
            return;
        }

        const response = await fetch('http://127.0.0.1:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('Регистрация успешна!');
            navigate('/login');
        } else {
            alert('Ошибка регистрации.');
        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Зарегистрироваться</button>
        </div>
    );
};

export default RegisterPage;