import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService, AtStrategy, RtStrategy],
  imports: [JwtModule.register({})],
  controllers: [AuthController],
})
export class AuthModule {}
