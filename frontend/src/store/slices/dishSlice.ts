import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Dish {
  id: number;
  name: string;
  components: string[];
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
  },
});

export const { addDish } = dishSlice.actions;
export default dishSlice.reducer;