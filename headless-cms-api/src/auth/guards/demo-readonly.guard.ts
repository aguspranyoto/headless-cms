import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class DemoReadonlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (request.method === 'GET') {
      return true;
    }

    let user = request.user;
    
    if (!user) {
      const authHeader = request.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const payloadBase64 = token.split('.')[1];
          user = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
        } catch (e) {}
      }
    }

    if (user && user.email === 'demo@agusp.com') {
      throw new ForbiddenException('Action not allowed in Demo mode');
    }
    
    return true;
  }
}
