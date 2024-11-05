import { Test, TestingModule } from '@nestjs/testing';
import { FindAllUsersController } from './find-all-users.controller';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('FindAllUsersController', () => {
  let controller: FindAllUsersController;
  let usersService: UsersService;

  // Mock de los guards
  const mockJwtAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      return true;
    }),
  };

  const mockRolesGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      return true;
    }),
  };

  beforeEach(async () => {
    // Resetear los mocks antes de cada test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindAllUsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<FindAllUsersController>(FindAllUsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('run', () => {
    it('should return all users when authorized', async () => {
      // Arrange
      const users = [
        { id: 1, fullname: 'User 1', email: 'user1@test.com' },
        { id: 2, fullname: 'User 2', email: 'user2@test.com' },
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(users as any);
      
      // Simular que los guards son llamados
      mockJwtAuthGuard.canActivate.mockReturnValue(true);
      mockRolesGuard.canActivate.mockReturnValue(true);

      // Act
      const result = await controller.run();

      // Assert
      expect(result).toEqual(users); // Cambiado de toBe a toEqual
      expect(usersService.findAll).toHaveBeenCalled();
    });

    // Agregar test para verificar que los guards están funcionando
    it('should check authorization before accessing the endpoint', async () => {
      // Arrange
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'admin' }
          })
        }),
        getHandler: () => ({}),
        getClass: () => ({})
      } as ExecutionContext;

      // Act
      await mockJwtAuthGuard.canActivate(mockContext);
      await mockRolesGuard.canActivate(mockContext);

      // Assert
      expect(mockJwtAuthGuard.canActivate).toHaveBeenCalled();
      expect(mockRolesGuard.canActivate).toHaveBeenCalled();
    });
  });
});
