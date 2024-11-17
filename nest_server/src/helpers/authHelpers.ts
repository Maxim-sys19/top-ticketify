import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

export const hashPwd = async (password: string, salt: number) => {
  return await bcrypt.hash(password, salt);
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateJti = () => {
  return Math.random().toString(36).substring(2, 15);
};
