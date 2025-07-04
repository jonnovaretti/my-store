import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { verifyPassword } from '@utils/password';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { AuthResponseDto, TokenPayload, TokensDto } from '../dtos/auth.dto';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User): Promise<AuthResponseDto> {
    const tokens = await this.generateTokens(user);

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    };
  }

  private async generateTokens(user: User): Promise<TokensDto> {
    const jti = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          type: 'access',
        } as TokenPayload,
        {
          expiresIn: '10m',
          secret: process.env.JWT_ACCESS_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          type: 'refresh',
          jti,
        } as TokenPayload,
        {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET,
        },
      ),
    ]);

    await this.userRepo.update(user.id, {
      refreshToken: jti,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<TokensDto> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      if (payload.type !== 'refresh' || !payload.jti) {
        throw new UnauthorizedException();
      }

      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException();
      }

      if (user.refreshToken !== payload.jti) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshToken: undefined });
  }
}
