import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDishes } from '../store/slices/dishSlice';
import { RootState } from '../store/store';
import DishCard, { Dish } from './DishCard';
import '../styles/components/dish-list.scss';

const DishList: React.FC = () => {
    const dispatch = useDispatch();
    const dishes = useSelector((state: RootState) => state.dishes.dishes);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const username = localStorage.getItem('username');
                if (!username) {
                    throw new Error('No username found');
                }

                const response = await fetch('http://127.0.0.1:8000/dishes', {
                    method: 'GET',
                    headers: {
                        'username': username,
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to fetch dishes');
                }

                const data = await response.json();
                dispatch(setDishes(data));
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch dishes');
                console.error('Error fetching dishes:', error);
            }
        };

        fetchDishes();
    }, [dispatch]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="dish-list">
            {dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
            ))}
        </div>
    );
};

export default DishList;