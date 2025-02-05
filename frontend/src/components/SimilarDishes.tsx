import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DishCard, { Dish } from './DishCard';
import '../styles/components/similar-dishes.scss';

interface SimilarDish extends Dish {
    matching_ingredients: number;
}

const SimilarDishes: React.FC<{ dishId: string }> = ({ dishId }) => {
    const [similarDishes, setSimilarDishes] = useState<SimilarDish[]>([]);
    const location = useLocation();
    const fromDishId = new URLSearchParams(location.search).get('fromDishId');

    useEffect(() => {
        const fetchSimilarDishes = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/similar-dishes/${dishId}`);
                const data = await response.json();
                const filteredDishes = data.filter((dish: SimilarDish) => dish.id !== fromDishId);
                setSimilarDishes(filteredDishes
                    .sort((a: SimilarDish, b: SimilarDish) => b.matching_ingredients - a.matching_ingredients)
                    .slice(0, 4) // Ограничиваем количество до 4
                );
            } catch (error) {
                console.error('Error fetching similar dishes:', error);
            }
        };

        if (dishId) {
            fetchSimilarDishes();
        }
    }, [dishId, fromDishId]);

    if (similarDishes.length === 0) {
        return null;
    }

    return (
        <div className="similar-dishes">
            <h3>Похожие блюда</h3>
            <div className="similar-dishes-grid">
                {similarDishes.map(dish => (
                    <div key={dish.id} className="similar-dish-wrapper">
                        <div className="matching-badge">
                            {dish.matching_ingredients} общих ингредиентов
                        </div>
                        <DishCard dish={dish} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimilarDishes;