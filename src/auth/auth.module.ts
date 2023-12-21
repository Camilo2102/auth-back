import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CryptoService } from 'src/crypto/crypto.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [CryptoModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), JwtModule.register({ global: true, secret: jwtConstants.secret , signOptions: { expiresIn: jwtConstants.expiresIn } })],
  controllers: [AuthController],
  providers: [AuthService, CryptoService]
})
export class AuthModule { }
