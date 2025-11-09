import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles-auth.decorator';
import { Request } from 'express';

export interface JwtRole {
  id: number;
  value: string;
  description: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  roles: JwtRole[];
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest<Request>();
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException({ message: 'No authorization header' });
      }

      const [bearer, token] = authHeader.split(' ') as [string, string];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User is not authorized' });
      }

      const user = this.jwtService.verify<JwtPayload>(token);
      req.user = user;

      const hasRole = user.roles.some((role) => {
        if (typeof role === 'string') return requiredRoles.includes(role);
        return requiredRoles.includes(role.value);
      });

      if (!hasRole) {
        throw new HttpException('Access denied: insufficient permissions', HttpStatus.FORBIDDEN);
      }

      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }
  }
}
