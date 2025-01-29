import { configureStore } from '@reduxjs/toolkit';
import dishReducer from './slices/dishSlice';

const store = configureStore({
    reducer: {
        dishes: dishReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>; // Тип для всего состояния
export type AppDispatch = typeof store.dispatch; // Тип для dispatch

export default store;