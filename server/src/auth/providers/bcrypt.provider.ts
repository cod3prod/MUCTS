import * as bcrypt from 'bcrypt';
import { HashingProvider } from './hashing.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  async comparePassword(
    data: string | Buffer,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(data, hashedPassword);
  }
}
