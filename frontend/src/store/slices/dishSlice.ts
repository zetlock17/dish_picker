import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface DishesState {
    dishes: Dish[];
}

const initialState: DishesState = {
    dishes: [],
};

const dishSlice = createSlice({
    name: 'dishes',
    initialState,
    reducers: {
        addDish: (state, action: PayloadAction<Dish>) => {
            state.dishes.push(action.payload);
        },
        setDishes: (state, action: PayloadAction<Dish[]>) => {
            state.dishes = action.payload;
        },
    },
});

export const { addDish, setDishes } = dishSlice.actions;
export default dishSlice.reducer;