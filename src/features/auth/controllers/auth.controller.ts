import {
  Controller,
  HttpStatus,
  HttpCode,
  Res,
  Req,
  Post,
  Get,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common'; // Importar UseGuards
import { SignUpDto } from '../dtos/sign-up.dto';
import { IMessage } from 'src/common/interfaces/message.interface';
import { AuthService } from '../providers/auth.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express-serve-static-core';
import { Public } from '../decorators/public.decorator';
import { Origin } from '../decorators/origin.decorator';
import { AuthResponseMapper } from '../mappers/auth-response.mapper';
import { CurrentUser } from '../decorators/current-user.decorator';
import { IAuthResponseUser } from '../interfaces/auth-response-user.interface';
import { AuthResponseUserMapper } from '../mappers/auth-response-user.mapper';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { Roles } from '../decorators/roles.decorator';
import { UserService } from 'src/features/users/providers/user.service';
import { RoleEnum } from '../enums/role.enum';

@Controller('auth')
export class AuthController {
  private readonly cookiePath = '/api/auth';
  private readonly cookieName: string;
  private readonly refreshTime: number;
  private readonly testing: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.cookieName = this.configService.get<string>('REFRESH_COOKIE');
    this.refreshTime = this.configService.get<number>('jwt.refresh.time');
    this.testing = this.configService.get<string>('NODE_ENV') !== 'production';
  }

  private refreshTokenFromReq(req: Request): string {
    const token: string | undefined = req.signedCookies[this.cookieName];

    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }

  private saveRefreshCookie(res: Response, refreshToken: string): Response {
    return res.cookie(this.cookieName, refreshToken, {
      secure: !this.testing,
      httpOnly: true,
      signed: true,
      path: this.cookiePath,
      expires: new Date(Date.now() + this.refreshTime * 1000),
    });
  }

  @ApiOkResponse({
    description: 'Sign in successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  @ApiNotFoundResponse({
    description: 'The user is not found.',
  })
  @Public()
  @Post('/sign-up')
  public async signUp(@Body() signUpDto: SignUpDto): Promise<IMessage> {
    return this.authService.signUp(signUpDto);
  }

  @ApiOkResponse({
    type: AuthResponseMapper,
    description: 'Sign in successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  @ApiNotFoundResponse({
    description: 'The user is not found.',
  })
  @Public()
  @Post('/sign-in')
  public async signIn(
    @Res() res: Response,
    @Origin() origin: string | undefined,
    @Body() singInDto: SignInDto,
  ): Promise<void> {
    const result = await this.authService.signIn(singInDto, origin);
    this.saveRefreshCookie(res, result.refreshToken)
      .status(HttpStatus.OK)
      .json(AuthResponseMapper.map(result));
  }

  @ApiOkResponse({
    type: AuthResponseMapper,
    description: 'Token refreshed',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  @ApiNotFoundResponse({
    description: 'The user is not found.',
  })
  @Public()
  @Post('/refresh-access')
  public async refreshAccess(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const token = this.refreshTokenFromReq(req);
    const result = await this.authService.refreshTokenAccess(
      token,
      req.headers.origin,
    );
    this.saveRefreshCookie(res, result.refreshToken)
      .status(HttpStatus.OK)
      .json(AuthResponseMapper.map(result));
  }

  @ApiOkResponse({
    description: 'Token refreshed',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  @ApiNotFoundResponse({
    description: 'The user is not found.',
  })
  @Post('/logout')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const token = this.refreshTokenFromReq(req);
    const message = await this.authService.logout(token);
    res
      .clearCookie(this.cookieName, { path: this.cookiePath })
      .status(HttpStatus.OK)
      .json(message);
  }

  @ApiOkResponse({
    type: AuthResponseUserMapper,
    description: 'Current user details',
  })
  @ApiNotFoundResponse({
    description: 'The user is not found.',
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Permissions('profile:view')
  @Get('/me')
  public async getMe(@CurrentUser() id: number): Promise<IAuthResponseUser> {
    const user = await this.userService.findOneById(id);
    return AuthResponseUserMapper.map(user);
  }
}
