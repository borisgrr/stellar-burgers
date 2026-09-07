import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredients/ingredientsSlice';
import feedReducer from '../slices/feed/feedSlice';
import ordersReducer from '../slices/orders/ordersSlice';
import burgerConstructorReducer from '../slices/burgerConstructor/burgerConstructorSlice';
import userReducer from '../slices/user/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  orders: ordersReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer
});
