import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

ReactDOM.render(
    <Provider store={store}> {/* Оборачиваем приложение в Provider */}
        <App />
    </Provider>,
    document.getElementById('root') // Рендерим в корневой элемент
);