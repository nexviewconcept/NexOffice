import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    
    // Only log mutations (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const url = req.originalUrl;
      // skip logging auth/login or audit itself
      if (!url.includes('/auth/login') && !url.includes('/audit')) {
        const userId = req.user?.userId || req.user?.id || null;
        
        let action = method;
        if (method === 'POST') action = 'CREATE';
        if (method === 'PUT' || method === 'PATCH') action = 'UPDATE';
        if (method === 'DELETE') action = 'DELETE';

        // Extract entity from URL (e.g. /api/v1/users -> users)
        const parts = url.split('/');
        const entity = parts[3] || 'unknown';
        const entityId = parts[4] && !parts[4].includes('?') ? parts[4] : null;

        return next.handle().pipe(
          tap(() => {
            // Log on success
            this.auditService.logAction({
              userId,
              action,
              entity: entity.toUpperCase(),
              entityId,
              ipAddress: req.ip
            });
          })
        );
      }
    }
    
    return next.handle();
  }
}
