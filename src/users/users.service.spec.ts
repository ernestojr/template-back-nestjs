import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockImplementation((str) => Promise.resolve(`hashed_${str}`)),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, fullname: 'Test User' }];
      jest.spyOn(repository, 'find').mockResolvedValue(users as User[]);

      expect(await service.findAll()).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: 1, fullname: 'Test User' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);

      expect(await service.findOne(1)).toBe(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow('Usuario con ID 1 no encontrado');
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        fullname: 'Test User',
        email: 'test@test.com',
        rut: '12345678-9',
        password: 'password123',
      };

      const user = { id: 1, ...createUserDto, password: 'hashed_password123' };
      
      jest.spyOn(repository, 'create').mockReturnValue(user as User);
      jest.spyOn(repository, 'save').mockResolvedValue(user as User);

      const result = await service.create(createUserDto);
      
      expect(result).toBe(user);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed_password123',
      });
    });
  });

  // ... más tests para update, delete, findByEmail
});
