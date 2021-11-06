import * as bycrypt from 'bcryptjs';
import config from '../../config';

export const hashPasswordService = {
  generateHash(password: string): string {
    return bycrypt.hashSync(password, config.bcyrpt.numberOfSaltRounds);
  },

  comparePasswords(password: string, hashedPassword: string): boolean {
    return bycrypt.compareSync(password, hashedPassword);
  },
};
