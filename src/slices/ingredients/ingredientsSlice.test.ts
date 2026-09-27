import { TIngredient } from '@utils-types';
import reducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredientsSlice', () => {
  test('Обрабатывает pending', () => {
    const state = {
      ingredients: [],
      isLoading: false,
      error: 'Ошибка'
    };

    const action = fetchIngredients.pending('some-request-id');

    const result = reducer(state, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('Обрабатывает fulfilled', () => {
    const state = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const ingredients: TIngredient[] = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: '...',
        image_large: '...',
        image_mobile: '...'
      }
    ];

    const action = fetchIngredients.fulfilled(ingredients, 'some-request-id');

    const result = reducer(state, action);

    expect(result).toEqual({
      ingredients: ingredients,
      isLoading: false,
      error: null
    });
  });

  test('Обрабатывает rejected', () => {
    const state = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const error = new Error('Сервер временно недоступен');

    const action = fetchIngredients.rejected(error, 'some-request-id');

    const result = reducer(state, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Сервер временно недоступен'
    });
  });

  test('Обрабатывает неизвестный action с undefined state', () => {
    const action = {
      type: 'UNKNOWN'
    };

    const result = reducer(undefined, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });
});
