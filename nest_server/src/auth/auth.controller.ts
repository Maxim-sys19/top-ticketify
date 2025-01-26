import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Render,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserDto } from '../dto/auth/user.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { ResetPasswordDto } from '../dto/auth/reset.pwd.dto';
import { ForgotPassword } from '../dto/auth/forgot-password.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Res() res: Response, @Body() registerDto: UserDto) {
    const result = await this.authService.register(registerDto);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: `${result.email} registered successfully.`,
    });
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto).then((userCredentials) => {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: `${userCredentials.email} login successfully.`,
        token: userCredentials.token,
      });
    });
  }

  @Render('email_confirmation')
  @Get('/email-comfirmation')
  async emailConfirmation(@Query('token') token: string) {
    return this.authService
      .emailConfirmation(token)
      .then((user) => {
        return { title: 'Email confirmation', name: user.name };
      })
      .catch((err) => {
        return { message: err.message, error: err.status };
      });
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Res() res: Response,
    @Body() forgotPasswordDto: ForgotPassword,
  ) {
    return this.authService
      .forgotPassword(forgotPasswordDto.email)
      .then((successResponse) => {
        return res.status(HttpStatus.OK).json({
          success: successResponse.success,
          message: `Email sent successfully - ${successResponse.id}`,
        });
      });
  }

  @Post('/reset-password')
  async resetPassword(
    @Res() res: Response,
    @Body() resetPwdDto: ResetPasswordDto,
  ) {
    return this.authService
      .resetPassword(resetPwdDto)
      .then((successResponse) => {
        return res.status(HttpStatus.OK).json(successResponse);
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Request() req: any) {
    const { headers } = req;
    return this.authService.logout(headers.authorization);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Request() req: any) {
    return req.user;
  }
}
