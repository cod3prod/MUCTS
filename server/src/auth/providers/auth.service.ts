import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class  AuthService {
    constructor(
        @Inject(UsersService)
        private usersService: UsersService,
    ) {}

    public async login(email: string, password: string)  {
        const user = await this.usersService.findUserById(1);
        console.log('auth test', user);
        return "SAMPLE_TOKEN";
    }

    public isAuth() {
        return true;
    }
}