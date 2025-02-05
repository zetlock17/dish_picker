import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDishes } from '../store/slices/dishSlice';
import { RootState } from '../store/store';
import DishCard, { Dish } from './DishCard';
import '../styles/components/dish-list.scss';

const DishList: React.FC = () => {
    const dispatch = useDispatch();
    const dishes = useSelector((state: RootState) => state.dishes.dishes);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 21;

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

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(dishes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentDishes = dishes.slice(startIndex, startIndex + itemsPerPage);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <div className="dish-list">
                {currentDishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DishList;