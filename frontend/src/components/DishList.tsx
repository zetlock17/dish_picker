import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setDishes } from '../store/slices/dishSlice';
import { RootState } from '../store/store';
import '../styles/components/dish-list.scss';

interface Dish {
    id: string;
    user_id: string;
    name: string;
    components: string;
    description?: string;
    image?: string;
    time?: number;
    dificulty?: number;
}

const DishList: React.FC = () => {
    const dispatch = useDispatch();
    const dishes = useSelector((state: RootState) => state.dishes.dishes);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const username = localStorage.getItem('username');
                const response = await fetch('http://127.0.0.1:8000/dishes', {
                    headers: {
                        'username': username || ''
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch dishes');
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    dispatch(setDishes(data));
                } else {
                    setError('Invalid data format');
                }
            } catch (error) {
                setError('Failed to fetch dishes');
                console.error('Error fetching dishes:', error);
            }
        };

        fetchDishes();
    }, [dispatch]);

    if (error) {
        return <div>{error}</div>;
    }

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