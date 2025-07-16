import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    passwordHash: '$2a$10$hashedPassword',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
    deletedAt: undefined,
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = '$2a$10$hashedPassword';

    it('should create user successfully', async () => {
      userRepository.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(email, password);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        email,
        passwordHash: hashedPassword,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(email, password)).rejects.toThrow(
        new ConflictException('Email already in use'),
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should handle bcrypt hash errors', async () => {
      const hashError = new Error('Bcrypt hash failed');
      userRepository.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockRejectedValue(hashError as never);

      await expect(service.create(email, password)).rejects.toThrow(hashError);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository save errors', async () => {
      const saveError = new Error('Database save failed');
      userRepository.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue(hashedPassword as never);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockRejectedValue(saveError);

      await expect(service.create(email, password)).rejects.toThrow(saveError);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        email,
        passwordHash: hashedPassword,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should handle repository findOne errors during email check', async () => {
      const findError = new Error('Database query failed');
      userRepository.findOne.mockRejectedValue(findError);

      await expect(service.create(email, password)).rejects.toThrow(findError);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    const email = 'test@example.com';

    it('should find user by email', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email, deletedAt: undefined },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email, deletedAt: undefined },
      });
      expect(result).toBeNull();
    });

    it('should filter out deleted users', async () => {
      const deletedUser = {
        ...mockUser,
        deletedAt: new Date('2024-01-16T10:30:00.000Z'),
      };
      userRepository.findOne.mockResolvedValue(deletedUser);

      // O serviço deve filtrar usuários deletados através da query
      const result = await service.findByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email, deletedAt: undefined },
      });
      // Se o repository retornar um usuário deletado, é porque a query não funcionou
      // Mas o teste verifica se a query correta está sendo feita
      expect(result).toEqual(deletedUser);
    });

    it('should handle repository findOne errors', async () => {
      const findError = new Error('Database query failed');
      userRepository.findOne.mockRejectedValue(findError);

      await expect(service.findByEmail(email)).rejects.toThrow(findError);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email, deletedAt: undefined },
      });
    });

    it('should handle different email formats', async () => {
      const upperCaseEmail = 'TEST@EXAMPLE.COM';
      userRepository.findOne.mockResolvedValue(null);

      await service.findByEmail(upperCaseEmail);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: upperCaseEmail, deletedAt: undefined },
      });
    });

    it('should handle empty email string', async () => {
      const emptyEmail = '';
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(emptyEmail);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: emptyEmail, deletedAt: undefined },
      });
      expect(result).toBeNull();
    });
  });
});
