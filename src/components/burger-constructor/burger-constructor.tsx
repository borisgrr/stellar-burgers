import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchBurgerConstructor } from '../../slices/burgerConstructor/burgerConstructorSlice';
import { closeOrderModal as closeOrderModalAction } from '../../slices/burgerConstructor/burgerConstructorSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchFeed } from '../../slices/feed/feedSlice';

export const BurgerConstructor: FC = () => {
  const burgerConstructorItems = useSelector(
    (state) => state.burgerConstructor
  );
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems = {
    bun: burgerConstructorItems.constructorItems.bun,
    ingredients: burgerConstructorItems.constructorItems.ingredients
  };

  const orderRequest = burgerConstructorItems.orderRequest;

  const orderModalData = burgerConstructorItems.orderModalData;

  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', {
        state: {
          from: location
        }
      });
      return;
    }

    dispatch(fetchBurgerConstructor())
      .unwrap()
      .then(() => {
        dispatch(fetchFeed());
      });
  };

  const closeOrderModal = () => {
    dispatch(closeOrderModalAction());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
