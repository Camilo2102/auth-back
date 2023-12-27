import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUserData = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user as any;
    return request.user[data];
  },
);
