import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as Bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async singupLocal(dto: AuthDTO): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const newUser: User = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    return this.getResponseTokens(newUser);
  }

  async singinLocal(dto: AuthDTO): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Acces Denied');

    const passwordMatches = await this.verify(dto.password, user.hash);

    if (!passwordMatches) throw new ForbiddenException('Acces Denied');

    return this.getResponseTokens(user);
  }

  async logout(userId: string) {
    await this.prismaService.user.update({
      data: {
        hashedRT: null,
      },
      where: {
        id: userId,
        hash: {
          not: undefined,
        },
      },
    });
  }

  async refreshToken(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied');

    const rtMatches = this.verify(refreshToken, user.hashedRT);

    if (!rtMatches) throw new ForbiddenException('Access Denied');

    return this.getResponseTokens(user);
  }

  /** Util functions */
  private hashData(data: string) {
    return Bcrypt.hash(data, 10);
  }

  private verify(data: string, hashData: string) {
    return Bcrypt.compare(data, hashData);
  }

  private async getResponseTokens(user: User) {
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  private generateToken(payload: any, secret: string, expiresIn: number) {
    return this.jwtService.signAsync(
      { ...payload },
      {
        secret: secret,
        expiresIn: expiresIn,
      },
    );
  }

  private async getTokens(userId: string, email: string): Promise<Tokens> {
    const payload = { sub: userId, email };
    const [at, rt] = await Promise.all([
      this.generateToken(payload, 'at-secret', 60 * 15),
      this.generateToken(payload, 'rt-secret', 60 * 60 * 24 * 7),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  private async updateRtHash(userId: string, refreshToken: string) {
    const hashRt = await this.hashData(refreshToken);
    await this.prismaService.user.update({
      data: {
        hashedRT: hashRt,
      },
      where: {
        id: userId,
      },
    });
  }
}
