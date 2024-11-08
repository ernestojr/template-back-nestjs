import { Test, TestingModule } from '@nestjs/testing';
import { SignUpController } from './sign-up.controller';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('SignUpController', () => {
  let controller: SignUpController;
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
      controllers: [SignUpController],
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

    controller = module.get<SignUpController>(SignUpController);
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
      const result = await controller.run(signUpDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });
});
