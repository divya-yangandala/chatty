import { setupServer } from 'msw/node';
import { authHandlers } from '@mocks/handlers/auth';

// setup requests interception using the given handlers

export const server = setupServer(...authHandlers);
