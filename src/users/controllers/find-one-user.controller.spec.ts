import { Test, TestingModule } from '@nestjs/testing';
import { FindOneUserController } from './find-one-user.controller';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('FindOneUserController', () => {
  let controller: FindOneUserController;
  let usersService: UsersService;

  // Definir los mocks de los guards
  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockImplementation((context: ExecutionContext) => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn().mockImplementation((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindOneUserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<FindOneUserController>(FindOneUserController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('run', () => {
    it('should return a single user when authorized', async () => {
      // Arrange
      const userId = 1;
      const user = {
        id: userId,
        fullname: 'Test User',
        email: 'test@test.com',
        rut: '12345678-9',
        role: 'user',
        active: true,
      };

      // Mock del servicio
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user as any);

      // Crear un mock del contexto de ejecución
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'admin' }
          })
        }),
        getHandler: () => ({}),
        getClass: () => ({})
      } as ExecutionContext;

      // Simular la activación de los guards
      await mockJwtAuthGuard.canActivate(mockExecutionContext);
      await mockRolesGuard.canActivate(mockExecutionContext);

      // Act
      const result = await controller.run(userId);

      // Assert
      expect(result).toEqual(user); // Cambiado de toBe a toEqual
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(mockJwtAuthGuard.canActivate).toHaveBeenCalled();
      expect(mockRolesGuard.canActivate).toHaveBeenCalled();
    });

    // Test adicional para verificar la autorización
    it('should check authorization before finding one user', async () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'admin' }
          })
        }),
        getHandler: () => ({}),
        getClass: () => ({})
      } as ExecutionContext;

      await mockJwtAuthGuard.canActivate(mockExecutionContext);
      await mockRolesGuard.canActivate(mockExecutionContext);

      expect(mockJwtAuthGuard.canActivate).toHaveBeenCalled();
      expect(mockRolesGuard.canActivate).toHaveBeenCalled();
    });
  });
});
