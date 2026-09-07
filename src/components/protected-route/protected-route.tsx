import { FC, ReactNode } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return children;
};
