import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { CryptoService } from 'src/crypto/crypto.service';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post("singup")
    async singup(@Body() createUserDTO: CreateUserDTO){
        return await this.authService.singup(createUserDTO);   
    }

    @Post("login")
    async login(@Body() loginUserDTO: LoginUserDTO){
        return await this.authService.login(loginUserDTO);
    }

    @Get("validateToken")
    async validateToken(@Headers('Authorization') authorizationHeader: string){
        if(!authorizationHeader) return {status: false, message: "No token provided"};

        const token = authorizationHeader.replace('Bearer ', '');
        
        return this.authService.validateToken(token);
    }

}
