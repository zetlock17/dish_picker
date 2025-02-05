import React, { useState, useRef } from 'react';
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
    const [time, setTime] = useState<number | ''>('');
    const [dificulty, setDificulty] = useState<number | ''>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddDish = async () => {
        if (!name || !components) {
            alert('Пожалуйста, заполните обязательные поля: Название и Компоненты.');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('name', name);
            formData.append('components', components);
            
            if (description) formData.append('description', description);
            if (time) formData.append('time', time.toString());
            if (dificulty) formData.append('dificulty', dificulty.toString());
            if (imageFile) formData.append('image', imageFile);

            const response = await fetch('http://127.0.0.1:8000/add_dish', {
                method: 'POST',
                headers: {
                    'username': localStorage.getItem('username') || '',
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to add dish');
            }

            const data = await response.json();
            dispatch(addDish({ 
                id: data.id,
                user_id: userId,
                name,
                components,
                description,
                image: imageFile ? data.id : undefined,
                time: time || undefined,
                dificulty: dificulty || undefined
            }));
            
            setName('');
            setComponents('');
            setDescription('');
            setImageFile(null);
            setImagePreview(null);
            setTime('');
            setDificulty('');
            onClose();

        } catch (error) {
            console.error('Error adding dish:', error);
            alert(`Ошибка при добавлении блюда: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
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
                <div className="image-upload">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <button onClick={() => fileInputRef.current?.click()}>
                        Выбрать изображение
                    </button>
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}
                </div>
                <button onClick={handleAddDish}>Добавить</button>
            </div>
        </div>
    );
};

export default AddDishModal;