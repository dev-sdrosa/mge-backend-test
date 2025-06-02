import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { CommonService } from 'src/common/providers/common.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { IMessage } from 'src/common/interfaces/message.interface';
import { TokenTypeEnum } from 'src/common/enums/token.enum';
import { SignInDto } from '../dtos/sign-in.dto';
import { IAuthResult } from '../dtos/auth.dto';
import { IRefreshToken } from 'src/common/interfaces/token/refresh-token.interface';
import { User } from 'src/features/users/entities/user.entity';
import { UserService } from 'src/features/users/providers/user.service';
import { JwtService } from 'src/features/jwt/providers/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly commonService: CommonService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(dto: SignUpDto): Promise<IMessage> {
    const { email, username, password1, password2 } = dto;

    this.comparePasswords(password1, password2);

    const user: any = await this.userService.new(email, username, password1);

    return this.commonService.generateMessage(
      'Registration successful! Confirm your email',
    );
  }

  public async signIn(dto: SignInDto, domain?: string): Promise<IAuthResult> {
    const { emailOrUsername, password } = dto;
    const user = await this.userByEmailOrUsername(emailOrUsername);
    // console.log('User in signIn:', emailOrUsername, password, user.password_hash); // For debugging
    if (!(await compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user,
      domain,
    );
    return { user, accessToken, refreshToken };
  }

  public async refreshTokenAccess(
    refreshToken: string,
    domain?: string,
  ): Promise<IAuthResult> {
    const { id, tokenId } = await this.jwtService.verifyToken<IRefreshToken>(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );
    const user = await this.userService.findById(id);
    const [accessToken, newRefreshToken] = await this.generateAuthTokens(
      user,
      domain,
      tokenId,
    );
    return { user, accessToken, refreshToken: newRefreshToken };
  }

  public async logout(refreshToken: string): Promise<IMessage> {
    const token = await this.jwtService.verifyToken<IRefreshToken>(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );
    return this.commonService.generateMessage('Logout successful');
  }

  private comparePasswords(password1: string, password2: string): void {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  public async userByEmailOrUsername(emailOrUsername: string): Promise<User> {
    if (emailOrUsername.includes('@')) {
      if (!emailOrUsername) {
        throw new BadRequestException('Invalid email');
      }
      return this.userService.findOneByEmail(emailOrUsername, true);
    }

    if (emailOrUsername.length < 3 || emailOrUsername.length > 106) {
      throw new BadRequestException('Invalid username');
    }
    return this.userService.findOneByUsername(emailOrUsername, true);
  }

  private async generateAuthTokens(
    user: User,
    domain?: string,
    tokenId?: string,
  ): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.ACCESS,
        domain,
        tokenId,
      ),
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.REFRESH,
        domain,
        tokenId,
      ),
    ]);
  }
}
