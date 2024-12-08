import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { LogInDto } from './dtos/log-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async logIn(@Body() logInDto: LogInDto) {
    return this.authService.logIn(logInDto);
  }
}
