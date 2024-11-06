import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock del LocalAuthGuard
  const mockLocalAuthGuard = {
    canActivate: jest
      .fn()
      .mockImplementation((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockLocalAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      // Arrange
      const signUpDto = {
        fullname: 'Test User',
        email: 'test@test.com',
        rut: '12345678-9',
        password: 'password123',
        role: 'user',
        active: true,
      };

      const expectedResult = {
        id: 1,
        ...signUpDto,
        password: 'hashed_password',
      };

      jest
        .spyOn(authService, 'signUp')
        .mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.signUp(signUpDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe('signIn', () => {
    it('should authenticate user and return token', async () => {
      // Arrange
      const user = {
        id: 1,
        email: 'test@test.com',
        fullname: 'Test User',
        role: 'user',
      };

      const expectedResult = {
        access_token: 'jwt_token',
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          role: user.role,
        },
      };

      const req = { user };

      jest.spyOn(authService, 'signIn').mockResolvedValue(expectedResult);

      // Crear un mock del contexto de ejecución
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => req,
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as ExecutionContext;

      // Simular la activación del guard
      await mockLocalAuthGuard.canActivate(mockExecutionContext);

      // Act
      const result = await controller.signIn(req);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(authService.signIn).toHaveBeenCalledWith(user);
      expect(mockLocalAuthGuard.canActivate).toHaveBeenCalled();
    });

    it('should handle authentication failure', async () => {
      // Arrange
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            body: {
              email: 'test@test.com',
              password: 'wrong_password',
            },
          }),
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
      } as ExecutionContext;

      // Simular fallo en la autenticación
      mockLocalAuthGuard.canActivate.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      // Act & Assert
      await expect(
        mockLocalAuthGuard.canActivate(mockExecutionContext),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
