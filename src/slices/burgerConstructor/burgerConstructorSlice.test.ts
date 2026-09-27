import { TNewOrderResponse } from '@api';
import reducer, {
  addBun,
  addIngredient,
  BurgerConstructorState,
  closeOrderModal,
  fetchBurgerConstructor,
  moveDown,
  moveUp,
  removeIngredient
} from './burgerConstructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

describe('burgerConstructorSlice', () => {
  describe('Асинхронные действия', () => {
    test('Обрабатывает pending', () => {
      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: {
          _id: '6ab80b1f6a172d001b995ded',
          status: 'done',
          name: 'Люминесцентный краторный бургер',
          owner: {
            createdAt: '2026-09-23T19:36:27.301Z',
            email: 'boris1@mail.ru',
            name: 'Борис',
            updatedAt: '2026-09-23T19:36:27.301Z'
          },
          createdAt: '2026-09-26T18:12:47.403Z',
          updatedAt: '2026-09-26T18:12:47.498Z',
          number: 110654,
          price: 3498
        }
      };

      const action = fetchBurgerConstructor.pending('some-request-id');

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: true,
        orderModalData: null
      });
    });

    test('Обрабатывает fulfilled', () => {
      const bun: TIngredient = {
        calories: 420,
        carbohydrates: 53,
        fat: 24,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        name: 'Краторная булка N-200i',
        price: 1255,
        proteins: 80,
        type: 'bun',
        _id: '643d69a5c3f7b9001cfa093c'
      };

      const ingredient: TConstructorIngredient = {
        calories: 643,
        carbohydrates: 85,
        fat: 26,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        name: 'Филе Люминесцентного тетраодонтимформа',
        price: 988,
        proteins: 44,
        type: 'main',
        id: 'abc',
        _id: '643d69a5c3f7b9001cfa093e'
      };

      const state: BurgerConstructorState = {
        constructorItems: {
          bun,
          ingredients: [ingredient]
        },
        orderRequest: true,
        orderModalData: null
      };

      const orderResponse: TNewOrderResponse = {
        success: true,
        order: {
          _id: '6ab80b1f6a172d001b995ded',
          status: 'done',
          name: 'Люминесцентный краторный бургер',
          owner: {
            createdAt: '2026-09-23T19:36:27.301Z',
            email: 'boris1@mail.ru',
            name: 'Борис',
            updatedAt: '2026-09-23T19:36:27.301Z'
          },
          createdAt: '2026-09-26T18:12:47.403Z',
          updatedAt: '2026-09-26T18:12:47.498Z',
          number: 110654,
          price: 3498
        },
        name: 'Люминесцентный краторный бургер'
      };

      const action = fetchBurgerConstructor.fulfilled(
        orderResponse,
        'some-request-id'
      );

      const result = reducer(state, action);

      expect(result).toEqual({
        orderRequest: false,
        orderModalData: action.payload.order,
        constructorItems: {
          bun: null,
          ingredients: []
        }
      });
    });

    test('Обрабатывает rejected', () => {
      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: true,
        orderModalData: {
          _id: '6ab80b1f6a172d001b995ded',
          status: 'done',
          name: 'Люминесцентный краторный бургер',
          owner: {
            createdAt: '2026-09-23T19:36:27.301Z',
            email: 'boris1@mail.ru',
            name: 'Борис',
            updatedAt: '2026-09-23T19:36:27.301Z'
          },
          createdAt: '2026-09-26T18:12:47.403Z',
          updatedAt: '2026-09-26T18:12:47.498Z',
          number: 110654,
          price: 3498
        }
      };

      const error = new Error('Ошибка заказа');

      const action = fetchBurgerConstructor.rejected(error, 'some-request-id');

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      });
    });

    test('Обрабатывает неизвестный action с undefined state', () => {
      const action = {
        type: 'UNKNOWN'
      };

      const result = reducer(undefined, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      });
    });
  });

  describe('Работа с ингредиентами', () => {
    test('Добавляет булку в конструктор', () => {
      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      };

      const bun: TIngredient = {
        calories: 420,
        carbohydrates: 53,
        fat: 24,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        name: 'Краторная булка N-200i',
        price: 1255,
        proteins: 80,
        type: 'bun',
        _id: '643d69a5c3f7b9001cfa093c'
      };

      const action = addBun(bun);

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      });
    });

    test('Не добавляет ингредиент как булку', () => {
      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      };

      const ingredient: TIngredient = {
        calories: 643,
        carbohydrates: 85,
        fat: 26,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        name: 'Филе Люминесцентного тетраодонтимформа',
        price: 988,
        proteins: 44,
        type: 'main',
        _id: '643d69a5c3f7b9001cfa093e'
      };

      const action = addBun(ingredient);

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      });
    });

    test('Добавляет ингредиент в конструктор', () => {
      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      };

      const ingredient: TConstructorIngredient = {
        calories: 643,
        carbohydrates: 85,
        fat: 26,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        name: 'Филе Люминесцентного тетраодонтимформа',
        price: 988,
        proteins: 44,
        type: 'main',
        id: 'abc',
        _id: '643d69a5c3f7b9001cfa093e'
      };

      const action = addIngredient(ingredient);

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: [ingredient]
        },
        orderRequest: false,
        orderModalData: null
      });
    });

    test('Убирает ингредиент из конструктора', () => {
      const firstIngredient: TConstructorIngredient = {
        calories: 643,
        carbohydrates: 85,
        fat: 26,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        name: 'Филе Люминесцентного тетраодонтимформа',
        price: 988,
        proteins: 44,
        type: 'main',
        id: 'abc',
        _id: '643d69a5c3f7b9001cfa093e'
      };

      const secondIngredient: TConstructorIngredient = {
        calories: 4242,
        carbohydrates: 242,
        fat: 142,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        name: 'Биокотлета из марсианской Магнолии',
        price: 424,
        proteins: 420,
        type: 'main',
        id: 'cba',
        _id: '643d69a5c3f7b9001cfa0941'
      };

      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient]
        },
        orderRequest: false,
        orderModalData: null
      };

      const action = removeIngredient(firstIngredient);

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: [secondIngredient]
        },
        orderRequest: false,
        orderModalData: null
      });
    });
  });

  describe('Перемещение ингредиентов', () => {
    test('Переносит ингредиент в конструкторе на позицию вниз', () => {
      const firstIngredient: TConstructorIngredient = {
        calories: 643,
        carbohydrates: 85,
        fat: 26,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        name: 'Филе Люминесцентного тетраодонтимформа',
        price: 988,
        proteins: 44,
        type: 'main',
        id: 'abc',
        _id: '643d69a5c3f7b9001cfa093e'
      };

      const secondIngredient: TConstructorIngredient = {
        calories: 4242,
        carbohydrates: 242,
        fat: 142,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        name: 'Биокотлета из марсианской Магнолии',
        price: 424,
        proteins: 420,
        type: 'main',
        _id: '643d69a5c3f7b9001cfa0941',
        id: 'cba'
      };

      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient]
        },
        orderRequest: false,
        orderModalData: null
      };

      const action = moveDown(firstIngredient);

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: [secondIngredient, firstIngredient]
        },
        orderRequest: false,
        orderModalData: null
      });
    });

    test('Переносит ингредиент в конструкторе на позицию вверх', () => {
      const firstIngredient: TConstructorIngredient = {
        calories: 643,
        carbohydrates: 85,
        fat: 26,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        name: 'Филе Люминесцентного тетраодонтимформа',
        price: 988,
        proteins: 44,
        type: 'main',
        id: 'abc',
        _id: '643d69a5c3f7b9001cfa093e'
      };

      const secondIngredient: TConstructorIngredient = {
        calories: 4242,
        carbohydrates: 242,
        fat: 142,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        name: 'Биокотлета из марсианской Магнолии',
        price: 424,
        proteins: 420,
        type: 'main',
        _id: '643d69a5c3f7b9001cfa0941',
        id: 'cba'
      };

      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient]
        },
        orderRequest: false,
        orderModalData: null
      };

      const action = moveUp(secondIngredient);

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: [secondIngredient, firstIngredient]
        },
        orderRequest: false,
        orderModalData: null
      });
    });

    test('Не перемещает первый ингредиент вверх', () => {
      const firstIngredient: TConstructorIngredient = {
        calories: 643,
        carbohydrates: 85,
        fat: 24,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        name: 'Филе Люминесцентного тетраодонтимформа',
        price: 988,
        proteins: 44,
        type: 'main',
        id: 'abc',
        _id: '643d69a5c3f7b9001cfa093e'
      };

      const secondIngredient: TConstructorIngredient = {
        calories: 4242,
        carbohydrates: 242,
        fat: 142,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        name: 'Биокотлета из марсианской Магнолии',
        price: 424,
        proteins: 420,
        type: 'main',
        _id: '643d69a5c3f7b9001cfa0941',
        id: 'cba'
      };

      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient]
        },
        orderRequest: false,
        orderModalData: null
      };

      const action = moveUp(firstIngredient);

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient]
        },
        orderRequest: false,
        orderModalData: null
      });
    });

    test('Не перемещает последний ингредиент вниз', () => {
      const firstIngredient: TConstructorIngredient = {
        calories: 643,
        carbohydrates: 85,
        fat: 24,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        name: 'Филе Люминесцентного тетраодонтимформа',
        price: 988,
        proteins: 44,
        type: 'main',
        id: 'abc',
        _id: '643d69a5c3f7b9001cfa093e'
      };

      const secondIngredient: TConstructorIngredient = {
        calories: 4242,
        carbohydrates: 242,
        fat: 142,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        name: 'Биокотлета из марсианской Магнолии',
        price: 424,
        proteins: 420,
        type: 'main',
        _id: '643d69a5c3f7b9001cfa0941',
        id: 'cba'
      };

      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient]
        },
        orderRequest: false,
        orderModalData: null
      };

      const action = moveDown(secondIngredient);

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient]
        },
        orderRequest: false,
        orderModalData: null
      });
    });
  });

  describe('Модальное окно заказа', () => {
    test('Закрывает модальное окно заказа', () => {
      const state: BurgerConstructorState = {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: {
          _id: '6ab80b1f6a172d001b995ded',
          status: 'done',
          name: 'Люминесцентный краторный бургер',
          owner: {
            createdAt: '2026-09-23T19:36:27.301Z',
            email: 'boris1@mail.ru',
            name: 'Борис',
            updatedAt: '2026-09-23T19:36:27.301Z'
          },
          createdAt: '2026-09-26T18:12:47.403Z',
          updatedAt: '2026-09-26T18:12:47.498Z',
          number: 110654,
          price: 3498
        }
      };

      const action = closeOrderModal();

      const result = reducer(state, action);

      expect(result).toEqual({
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      });
    });
  });
});
