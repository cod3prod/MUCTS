import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersController } from './users.controller';
import { PatchUserProvider } from './providers/patch-user.provider';
import { CreateUserProvider } from './providers/create-user.provider';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService, 
        PatchUserProvider,
        CreateUserProvider
    ],
    exports: [UsersService],
    imports: [forwardRef(()=>AuthModule),TypeOrmModule.forFeature([User])]
})
export class UsersModule {}
