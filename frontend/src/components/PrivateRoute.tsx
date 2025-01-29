import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuth } = useAuth();

    return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;