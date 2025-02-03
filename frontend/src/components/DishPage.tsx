import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface DishPageProps {}

const DishPage: React.FC<DishPageProps> = () => {
    const { id } = useParams<{ id: string }>();
    const dish = useSelector((state: RootState) =>
        state.dishes.dishes.find((dish) => dish.id === id)
    );

    if (!dish) {
        return <div>Блюдо не найдено</div>;
    }

    return (
        <div>
            <h2>{dish.name}</h2>
            <p>{dish.description}</p>
            {dish.image && <img src={dish.image} alt={dish.name} />}
            <p>Компоненты: {dish.components}</p>
            {dish.time && <p>Время приготовления: {dish.time} минут</p>}
            {dish.dificulty && <p>Сложность: {dish.dificulty}</p>}
        </div>
    );
};

export default DishPage;