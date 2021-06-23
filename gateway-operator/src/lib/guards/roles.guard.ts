import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_METADATA_KEY } from '../decorators/public-private.decorator';
import { jwtAuth } from '../jwt';
import { USER_TYPE_METADATA_KEY } from '../decorators/user-type.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const handler = context.getHandler();
        const thisClass = context.getClass();

        // Controller can be public, but not a route
        const isPublicRoute = handler && this.isPublic(handler);

        if (isPublicRoute) return true;
        if (isPublicRoute !== false && thisClass && this.isPublic(thisClass)) return true;

        const req: Request = context.switchToHttp().getRequest();

        const token = req.headers['authorization'];
        if (!token) throw new UnauthorizedException();

        const { data } = jwtAuth.jwtVerify(token);
        if (!data) return false;

        req.user = data;

        /**
         * NOTE: Check class and handler if you want universal guard for whole controller or route
         */
        if (handler && (await this.isRestrictedCtx(handler, data))) return false;
        if (thisClass && (await this.isRestrictedCtx(thisClass, data))) return false;

        return true;
    }

    async isRestrictedCtx(ctx: Function, user: JWT.TokenPayload): Promise<boolean> {
        const userType: JWT.UserType | undefined = this.reflector.get(USER_TYPE_METADATA_KEY, ctx);
        if (userType && userType !== user.userType) {
            return true;
        }

        return false;
    }

    isPublic(ctx: Function): boolean | undefined {
        return this.reflector.get<boolean>(IS_PUBLIC_METADATA_KEY, ctx);
    }
}
