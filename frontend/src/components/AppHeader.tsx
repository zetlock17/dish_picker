import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/header.scss';
import AddDishModal from './AddDishModal';

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="header">
            <div><Link to='/'>Dish Picker</Link></div>
            <div></div>
            <div><button onClick={openModal}>Добавить блюдо</button></div>
            <div><Link to='/account'>Аккаунт</Link></div>
            <AddDishModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default AppHeader;