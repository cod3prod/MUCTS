import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
    imports: [forwardRef(()=>AuthModule),TypeOrmModule.forFeature([User])]
})
export class UsersModule {}
