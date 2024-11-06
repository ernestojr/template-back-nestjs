import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from './delete-user.controller';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('DeleteUserController', () => {
  let controller: DeleteUserController;
  let usersService: UsersService;

  // Definir los mocks de los guards
  const mockJwtAuthGuard = {
    canActivate: jest
      .fn()
      .mockImplementation((context: ExecutionContext) => true),
  };

  const mockRolesGuard = {
    canActivate: jest
      .fn()
      .mockImplementation((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<DeleteUserController>(DeleteUserController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('run', () => {
    it('should delete a user when authorized', async () => {
      // Arrange
      const userId = 1;

      // Mock del servicio
      jest.spyOn(usersService, 'delete').mockResolvedValue(undefined);

      // Crear un mock del contexto de ejecución
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'admin' },
          }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as ExecutionContext;

      // Simular la activación de los guards
      await mockJwtAuthGuard.canActivate(mockExecutionContext);
      await mockRolesGuard.canActivate(mockExecutionContext);

      // Act
      await controller.run(userId);

      // Assert
      expect(usersService.delete).toHaveBeenCalledWith(userId);
      expect(mockJwtAuthGuard.canActivate).toHaveBeenCalled();
      expect(mockRolesGuard.canActivate).toHaveBeenCalled();
    });

    // Test adicional para verificar el comportamiento de autorización
    it('should check authorization before deleting', async () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'admin' },
          }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as ExecutionContext;

      await mockJwtAuthGuard.canActivate(mockExecutionContext);
      await mockRolesGuard.canActivate(mockExecutionContext);

      expect(mockJwtAuthGuard.canActivate).toHaveBeenCalled();
      expect(mockRolesGuard.canActivate).toHaveBeenCalled();
    });
  });
});
