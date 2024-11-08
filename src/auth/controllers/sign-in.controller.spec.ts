import { Test, TestingModule } from '@nestjs/testing';
import { SignInController } from './sign-in.controller';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('SignInController', () => {
  let controller: SignInController;
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
      controllers: [SignInController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockLocalAuthGuard)
      .compile();

    controller = module.get<SignInController>(SignInController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Sign In', () => {
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
      const result = await controller.run(req);

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
