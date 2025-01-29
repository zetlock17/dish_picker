import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const DishList: React.FC = () => {
    const dishes = useSelector((state: RootState) => state.dishes.dishes);

    return (
        <div>
            <h2>Список блюд</h2>
            <ul>
                {dishes.map((dish) => (
                    <li key={dish.id}>
                        <h3>{dish.name}</h3>
                        <p>{dish.description}</p>
                        {dish.image && <img src={dish.image} alt={dish.name} />}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DishList;