import { orderBurgerApi, TNewOrder } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

type BurgerConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TNewOrder | null;
};

const initialState: BurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const fetchBurgerConstructor = createAsyncThunk(
  'burgerConstructor',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const arrId = state.burgerConstructor.constructorItems.ingredients.map(
      (item) => item._id
    );
    const bun = state.burgerConstructor.constructorItems.bun;

    if (bun) {
      arrId.unshift(bun._id);
      arrId.push(bun._id);
    }

    return orderBurgerApi(arrId);
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',

  initialState,

  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      }
    },

    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },

    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
    },

    moveUp: (state, action: PayloadAction<TConstructorIngredient>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload.id
      );
      if (index === 0) return;
      const current = state.constructorItems.ingredients[index];

      state.constructorItems.ingredients[index] =
        state.constructorItems.ingredients[index - 1];

      state.constructorItems.ingredients[index - 1] = current;
    },

    moveDown: (state, action: PayloadAction<TConstructorIngredient>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (ingredient) => action.payload.id === ingredient.id
      );

      if (index === state.constructorItems.ingredients.length - 1) return;

      const current = state.constructorItems.ingredients[index];

      state.constructorItems.ingredients[index] =
        state.constructorItems.ingredients[index + 1];

      state.constructorItems.ingredients[index + 1] = current;
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBurgerConstructor.pending, (state) => {
      state.orderRequest = true;
      state.orderModalData = null;
    });
    builder.addCase(fetchBurgerConstructor.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload.order;
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    });
    builder.addCase(fetchBurgerConstructor.rejected, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = null;
    });
  }
});

export default burgerConstructorSlice.reducer;

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveUp,
  moveDown,
  closeOrderModal
} = burgerConstructorSlice.actions;
