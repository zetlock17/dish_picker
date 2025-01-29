import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDish } from '../store/slices/dishSlice';
import '../styles/components/add-dish-modal.scss';

interface AddDishModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddDishModal: React.FC<AddDishModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [components, setComponents] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const dispatch = useDispatch();

    const handleAddDish = () => {
        const newDish = {
            id: Date.now(),
            name,
            components: components.split(','),
            description,
            image,
        };
        dispatch(addDish(newDish));
        setName(''); // Очистка поля "Название"
        setComponents(''); // Очистка поля "Компоненты"
        setDescription(''); // Очистка поля "Описание"
        setImage(''); // Очистка поля "URL изображения"
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Добавить блюдо</h2>
                <input
                    type="text"
                    placeholder="Название"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Компоненты (через запятую)"
                    value={components}
                    onChange={(e) => setComponents(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="URL изображения"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />
                <button onClick={handleAddDish}>Добавить</button>
            </div>
        </div>
    );
};

export default AddDishModal;