import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { Tokens } from './types';
import { AtGuard, RtGuard } from './common/guards';
import { GetCurrentUserData } from './common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/singup')
  @HttpCode(HttpStatus.CREATED)
  singupLocal(@Body() dto: AuthDTO): Promise<Tokens> {
    return this.authService.singupLocal(dto);
  }

  @Post('local/singin')
  @HttpCode(HttpStatus.OK)
  singinLocal(@Body() dto: AuthDTO): Promise<Tokens> {
    return this.authService.singinLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserData('sub') userId: string) {
    this.authService.logout(userId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  refreshToken(@GetCurrentUserData() user: any): Promise<Tokens> {
    return this.authService.refreshToken(user['sub'], user['refreshToken']);
  }
}
