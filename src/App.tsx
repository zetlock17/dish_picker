import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.scss';
import AppHeader from './components/AppHeader';
import MainPage from './components/MainPage';
import AccountPage from './components/AccountPage';
import DishPage from './components/DishPage';

const App: React.FC = () => {
    return (
        <Router>
            <AppHeader />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/dish" element={<DishPage />} />
            </Routes>
        </Router>
    );
};

export default App;