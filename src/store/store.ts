import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlice';

const store = configureStore({
    reducer: {
        todos: todoReducer, // Подключаем редюсер для задач
    },
});

export type RootState = ReturnType<typeof store.getState>; // Тип для всего состояния
export type AppDispatch = typeof store.dispatch; // Тип для dispatch

export default store;