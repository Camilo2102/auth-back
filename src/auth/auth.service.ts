import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import { CryptoService } from 'src/crypto/crypto.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenData } from './dto/token-data.dto';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private readonly cryptoService: CryptoService, private readonly jwtService: JwtService) { }

    async singup(createUserDTO: CreateUserDTO): Promise<User> {
        try {
            const hashedPassword = await this.cryptoService.hashPassword(createUserDTO.password);
            createUserDTO.password = hashedPassword;

            const createdUser = await this.userModel.create(createUserDTO);
            return createdUser;
        } catch (error) {
            if (error.code === 11000 || error.code === 11001) {
                throw new HttpException('The user or the mail already exist.', HttpStatus.CONFLICT);
            } else {
                throw error;
            }
        }

    }

    async login(loginUserDTO: LoginUserDTO): Promise<TokenData> {
        const foundUser = await this.userModel.findOne({
            $or: [
                { mail: loginUserDTO.credential },
                { user: loginUserDTO.credential },
            ]
        });

        if (!foundUser) throw new HttpException("not found", HttpStatus.CONFLICT);

        const isPasswordValid = await this.cryptoService.comparePasswords(loginUserDTO.password, foundUser.password);

        if (!isPasswordValid) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

        const payload = {
            user: foundUser.user,
            mail: foundUser.mail
        }

        return {
            ascces_token: await this.jwtService.signAsync(payload)
        };
    }

    async validateToken(token: string): Promise<any> {
        try {            
            await this.jwtService.verifyAsync(token)
            return {status: true, message: "Validated"};;
        } catch (error) {
            return {status: false, message: "Invalid Token"};;
        }
    }

}
