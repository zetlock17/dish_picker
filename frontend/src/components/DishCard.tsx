import React from 'react';
import { Link } from 'react-router-dom';

export interface Dish {
    id: string;
    user_id: string;
    name: string;
    components: string;
    description?: string;
    image?: string;
    time?: number;
    dificulty?: number;
}

interface DishCardProps {
    dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
    const imageUrl = dish.image ? `http://127.0.0.1:8000/dish_image/${dish.id}` : null;

    return (
        <Link to={`/dish/${dish.id}`} className="dish-card-link">
            <div className="dish-card">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                {imageUrl && (
                    <img 
                        src={imageUrl} 
                        alt={dish.name}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                )}
            </div>
        </Link>
    );
};

export default DishCard;