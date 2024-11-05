import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserController } from './create-user.controller';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('CreateUserController', () => {
  let controller: CreateUserController;
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
      controllers: [CreateUserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<CreateUserController>(CreateUserController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('run', () => {
    it('should create a user when authorized', async () => {
      // Arrange
      const createUserDto = {
        fullname: 'Test User',
        email: 'test@test.com',
        rut: '12345678-9',
        password: 'password123',
        role: 'user',
        active: true,
      };

      const expectedResult = { id: 1, ...createUserDto };
      
      // Mock del servicio
      jest.spyOn(usersService, 'create').mockResolvedValue(expectedResult as any);

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
      const result = await controller.run(createUserDto);

      // Assert
      expect(result).toEqual(expectedResult); // Cambiado de toBe a toEqual
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockJwtAuthGuard.canActivate).toHaveBeenCalled();
      expect(mockRolesGuard.canActivate).toHaveBeenCalled();
    });

    // Test adicional para verificar la autorización
    it('should check authorization before creating', async () => {
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
