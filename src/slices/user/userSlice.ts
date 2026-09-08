import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../../src/utils/cookie';

type UserState = {
  user: TUser | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null
};

export const loginUser = createAsyncThunk<TAuthResponse, TLoginData>(
  'user/loginUser',
  async (data) => {
    const response = await loginUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();

  return response.user;
});

export const registerUser = createAsyncThunk<TAuthResponse, TRegisterData>(
  'user/registerUser',
  async (user) => {
    const response = await registerUserApi(user);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);

    return response;
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);

    return response;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);

    return response;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi();

  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');

  return response;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;

      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;

      state.error = null;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;

      state.error = action.error.message ?? 'Ошибка авторизации';
    });

    // REGISTER
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;

      state.error = null;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;

      state.error = null;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;

      state.error = action.error.message ?? 'Ошибка регистрации';
    });

    // GET USER
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
      state.isAuthChecked = false;
      state.error = null;
    });

    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isAuthChecked = true;
      state.error = null;
    });

    builder.addCase(getUser.rejected, (state, action) => {
      state.user = null;
      state.isLoading = false;
      state.isAuthChecked = true;
      state.error = action.error.message ?? 'Ошибка пользователя';
    });

    // FORGOT PASSWORD
    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;

      state.error = null;
    });

    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.isLoading = false;

      state.error = null;
    });

    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;

      state.error = action.error.message ?? 'Не удалось сбросить пароль';
    });

    // RESET PASSWORD
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;

      state.error = null;
    });

    builder.addCase(resetPassword.fulfilled, (state) => {
      state.isLoading = false;

      state.error = null;
    });

    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;

      state.error = action.error.message ?? 'Не удалось сбросить пароль';
    });

    // UPDATE USER
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;

      state.error = null;
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;

      state.error = null;
    });

    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;

      state.error =
        action.error.message ?? 'Не удалось обновить данные пользователя';
    });

    // LOGOUT
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;

      state.error = null;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isLoading = false;

      state.error = null;
    });

    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;

      state.error = action.error.message ?? 'Не удалось выйти из аккаунта';
    });
  }
});

export default userSlice.reducer;
