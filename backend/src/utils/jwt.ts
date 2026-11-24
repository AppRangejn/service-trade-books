import jwt, { SignOptions } from 'jsonwebtoken';
import { AUTH_CONFIG, UserRole } from '../constants';

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
  type: typeof AUTH_CONFIG.JWT_TOKEN_TYPE;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

export const signAccessToken = (payload: Omit<JwtPayload, 'type'>): string => {
  const options: SignOptions = {
    expiresIn:
      (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ||
      AUTH_CONFIG.JWT_EXPIRES_IN,
    issuer: AUTH_CONFIG.JWT_ISSUER,
    audience: AUTH_CONFIG.JWT_AUDIENCE,
  };

  return jwt.sign(
    { ...payload, type: AUTH_CONFIG.JWT_TOKEN_TYPE },
    getJwtSecret(),
    options,
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, getJwtSecret(), {
    issuer: AUTH_CONFIG.JWT_ISSUER,
    audience: AUTH_CONFIG.JWT_AUDIENCE,
  }) as JwtPayload;

  if (decoded.type !== AUTH_CONFIG.JWT_TOKEN_TYPE || !decoded.id) {
    throw new Error('Invalid token type');
  }

  return decoded;
};
