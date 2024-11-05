import { ExecutionContext } from '@nestjs/common';

export const mockJwtAuthGuard = {
  canActivate: jest.fn((context: ExecutionContext) => true),
};

export const mockRolesGuard = {
  canActivate: jest.fn((context: ExecutionContext) => true),
};
