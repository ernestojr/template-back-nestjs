import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserController } from './update-user.controller';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UpdateUserController', () => {
  let controller: UpdateUserController;
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
      controllers: [UpdateUserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<UpdateUserController>(UpdateUserController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('run', () => {
    it('should update a user when authorized', async () => {
      // Arrange
      const userId = 1;
      const updateUserDto = {
        fullname: 'Updated User',
        active: false,
      };

      const updatedUser = [1, [{
        id: userId,
        ...updateUserDto,
        email: 'test@test.com',
        rut: '12345678-9',
        role: 'user',
      }]];

      // Mock del servicio
      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser as any);

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
      const result = await controller.run(userId, updateUserDto);

      // Assert
      expect(result).toEqual(updatedUser); // Cambiado de toBe a toEqual
      expect(usersService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(mockJwtAuthGuard.canActivate).toHaveBeenCalled();
      expect(mockRolesGuard.canActivate).toHaveBeenCalled();
    });
  });
});
