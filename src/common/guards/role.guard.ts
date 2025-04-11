import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccountRoleEnum } from '../enums/account-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roles: AccountRoleEnum[]) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.roles.includes(request.currentaccount.role);
  }
}
