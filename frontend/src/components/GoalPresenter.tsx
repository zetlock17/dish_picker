import React, { useEffect, useState, useRef } from 'react';
import DishCard, { Dish } from './DishCard';
import '../styles/components/goal-presenter.scss';

const GoalPresenter: React.FC = () => {
    const [recommendations, setRecommendations] = useState<Dish[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/recommendations', {
                    headers: {
                        'username': localStorage.getItem('username') || '',
                    }
                });
                const data = await response.json();
                setRecommendations(data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, []);

    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, [recommendations.length]);

    const startAutoSlide = () => {
        stopAutoSlide();
        intervalRef.current = setInterval(() => {
            setCurrentIndex(current => 
                current === recommendations.length - 3 ? 0 : current + 1
            );
        }, 5000);
    };

    const stopAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const nextSlide = () => {
        setCurrentIndex(current => 
            current === recommendations.length - 3 ? 0 : current + 1
        );
        startAutoSlide();
    };

    const prevSlide = () => {
        setCurrentIndex(current => 
            current === 0 ? recommendations.length - 3 : current - 1
        );
        startAutoSlide();
    };

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="carousel">
            <h2>Рекомендуем попробовать</h2>
            <div className="carousel-content">
                <button className="carousel-button prev" onClick={prevSlide}>
                    &#8249;
                </button>
                <div className="carousel-items">
                    {recommendations.slice(currentIndex, currentIndex + 3).map(dish => (
                        <DishCard key={dish.id} dish={dish} />
                    ))}
                </div>
                <button className="carousel-button next" onClick={nextSlide}>
                    &#8250;
                </button>
            </div>
        </div>
    );
};

export default GoalPresenter;