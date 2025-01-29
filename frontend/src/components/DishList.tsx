import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import '../styles/components/dish-list.scss';

const DishList: React.FC = () => {
    const dishes = useSelector((state: RootState) => state.dishes.dishes);

    return (
        <div>
            <div className="dish-list">
                {dishes.map((dish) => (
                    <Link to={`/dish/${dish.id}`} key={dish.id} className="dish-card-link">
                        <div className="dish-card">
                            <h3>{dish.name}</h3>
                            <p>{dish.description}</p>
                            {dish.image && <img src={dish.image} alt={dish.name} />}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DishList;