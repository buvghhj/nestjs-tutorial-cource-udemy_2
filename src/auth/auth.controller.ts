import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() authCredentialsDto: AuthCredentialsDto) {

        return this.authService.register(authCredentialsDto)

    }

    @Post('login')
    login(@Body() authCredentialsDto: AuthCredentialsDto) {

        return this.authService.login(authCredentialsDto)

    }
}
