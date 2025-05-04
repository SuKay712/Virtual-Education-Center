import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { AccountService } from '../../modules/account/account.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // console.log(payload);
      const account = await this.accountService.findByEmail(payload.email);
      if (!account) {
        throw new BadRequestException(
          'account not belong to token, please try again'
        );
      }
      request.currentaccount = account;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Token has expired');
      }

      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
