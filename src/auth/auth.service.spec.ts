import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  // Mock de los servicios
  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password when credentials are valid', async () => {
      // Arrange
      const email = 'test@test.com';
      const password = 'password123';
      const hashedPassword = 'hashed_password';
      
      const mockUser = {
        id: 1,
        email,
        password: hashedPassword,
        fullname: 'Test User',
        role: 'user',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.validateUser(email, password);

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        fullname: mockUser.fullname,
        role: mockUser.role,
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      mockUsersService.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.validateUser('test@test.com', 'password123');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      // Arrange
      const mockUser = {
        email: 'test@test.com',
        password: 'hashed_password',
        toJSON: () => ({
          email: 'test@test.com',
          password: 'hashed_password',
        }),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.validateUser('test@test.com', 'wrong_password');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('signIn', () => {
    it('should return access token and user data', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        fullname: 'Test User',
        role: 'user',
      };

      const mockToken = 'jwt_token';
      mockJwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await service.signIn(mockUser as any);

      // Assert
      expect(result).toEqual({
        access_token: mockToken,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });
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

      const mockCreatedUser = {
        id: 1,
        ...signUpDto,
        password: 'hashed_password',
      };

      mockUsersService.create.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await service.signUp(signUpDto);

      // Assert
      expect(result).toEqual(mockCreatedUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(signUpDto);
    });
  });
});
