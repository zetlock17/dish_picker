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
    const [time, setTime] = useState<number | ''>('');
    const [dificulty, setDificulty] = useState<number | ''>('');
    const dispatch = useDispatch();

    const handleAddDish = () => {
        if (!name || !components) {
            alert('Пожалуйста, заполните обязательные поля: Название и Компоненты.');
            return;
        }

        if (dificulty && (dificulty < 1 || dificulty > 10)) {
            alert('Пожалуйста, введите сложность в диапазоне от 1 до 10.');
            setDificulty('');
            return;
        }

        const newDish = {
            id: Date.now(),
            name,
            components: components.split(','),
            description,
            image,
            time: time ? Number(time) : undefined,
            dificulty: dificulty ? Number(dificulty) : undefined,
        };
        dispatch(addDish(newDish));
        setName(''); // Очистка поля "Название"
        setComponents(''); // Очистка поля "Компоненты"
        setDescription(''); // Очистка поля "Описание"
        setImage(''); // Очистка поля "URL изображения"
        setTime(''); // Очистка поля "Время"
        setDificulty(''); // Очистка поля "Сложность"
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
                    placeholder="Название (обязательно)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Компоненты (обязательно, через запятую)"
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
                <input
                    type="number"
                    placeholder="Время приготовления (минуты)"
                    value={time}
                    onChange={(e) => setTime(e.target.value ? Number(e.target.value) : '')}
                />
                <input
                    type="number"
                    placeholder="Сложность (1-10)"
                    value={dificulty}
                    onChange={(e) => setDificulty(e.target.value ? Number(e.target.value) : '')}
                />
                <button onClick={handleAddDish}>Добавить</button>
            </div>
        </div>
    );
};

export default AddDishModal;