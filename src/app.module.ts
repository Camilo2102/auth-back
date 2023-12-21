import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoModule } from './crypto/crypto.module';
import { appConstants } from './constants';

@Module({
  imports: [AuthModule, MongooseModule.forRoot(appConstants.DB_URL), CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
