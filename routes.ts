import { pathToRegexp } from 'path-to-regexp';

export const publicRoutes = [pathToRegexp('/'), pathToRegexp('/detail/:id')];

export const authRoutes = ['/login', '/register'];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT = '/settings';
