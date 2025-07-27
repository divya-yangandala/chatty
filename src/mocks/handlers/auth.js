import { existingUser, userJwt } from '@mocks/data/user.mock';
import { rest } from 'msw';

const BASE_URL = `${process.env.REACT_APP_BASE_ENDPOINT}/api/v1`;

export const signInMock = rest.post(`${BASE_URL}/signin`, (req, res, ctx) => {
  const result = { message: 'User login successfully', user: existingUser, token: userJwt }
  return res(ctx.json(result));
});

export const signUpMock = rest.post(`${BASE_URL}/signup`, (req, res, ctx) => {
  const result = { message: 'User created successfully', user: existingUser, token: userJwt }
  return res(ctx.json(result));
});

export const forgotPasswordMock = rest.post(`${BASE_URL}/forgot-password`, (req, res, ctx) => {
  const result = { message: 'Password reset meail sent.' }
  return res(ctx.json(result));
});

export const resetPasswordMock = rest.post(`${BASE_URL}/reset-password/123456789`, (req, res, ctx) => {
  const result = { message: 'Password successfully updated' }
  return res(ctx.json(result));
});

export const signInMockError = rest.post(`${BASE_URL}/signup`, (req, res, ctx) => {
  const result = { message: 'Invalid credentials' }
  return res(ctx.status(400), ctx.json(result));
})

export const signUpMockError = rest.post(`${BASE_URL}/signup`, (req, res, ctx) => {
  const result = { message: 'Invalid credentials' }
  return res(ctx.status(400), ctx.json(result));
})

export const authHandlers = [signInMock,
  signUpMock,
  forgotPasswordMock,
  resetPasswordMock,
  signInMockError,
  signUpMockError];
