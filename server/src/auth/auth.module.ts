import { Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [],
  providers: [AuthService],
  imports: [UsersModule],
  exports: [AuthService],
})
export class AuthModule {}
