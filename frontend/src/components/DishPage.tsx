import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface DishPageProps {}

const DishPage: React.FC<DishPageProps> = () => {
    const { id } = useParams<{ id: string }>();
    const dish = useSelector((state: RootState) =>
        state.dishes.dishes.find((dish) => dish.id === id)
    );

    useEffect(() => {
        const recordVisit = async () => {
            try {
                await fetch(`http://127.0.0.1:8000/record_visit/${id}`, {
                    method: 'POST',
                    headers: {
                        'username': localStorage.getItem('username') || '',
                    }
                });
            } catch (error) {
                console.error('Failed to record visit:', error);
            }
        };

        if (id) {
            recordVisit();
        }
    }, [id]);

    if (!dish) {
        return <div>Блюдо не найдено</div>;
    }

    return (
        <div>
            <h2>{dish.name}</h2>
            <p>{dish.description}</p>
            {dish.image && <img src={`http://127.0.0.1:8000/dish_image/${dish.id}`} alt={dish.name} />}
            <p>Компоненты: {dish.components}</p>
            {dish.time && <p>Время приготовления: {dish.time} минут</p>}
            {dish.dificulty && <p>Сложность: {dish.dificulty}</p>}
        </div>
    );
};

export default DishPage;