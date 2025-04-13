import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { JwtService } from '@nestjs/jwt';
// import { CustomMailerService } from '../mailer/mailer.service';
import { Repository } from 'typeorm';
import { Account } from '../../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let accountService: AccountService;
  let jwtService: JwtService;
  let accountRepo: Repository<Account>;

  const mockAccountRepo = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockAccountService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockMailerService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AccountService, useValue: mockAccountService },
        { provide: JwtService, useValue: mockJwtService },
        // { provide: CustomMailerService, useValue: mockMailerService },
        { provide: getRepositoryToken(Account), useValue: mockAccountRepo },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    accountService = module.get<AccountService>(AccountService);
    jwtService = module.get<JwtService>(JwtService);
    accountRepo = module.get<Repository<Account>>(getRepositoryToken(Account));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    const mockLoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockAccount = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: bcrypt.hashSync('password123', 10),
      isActive: true,
      role: 'user',
      displayName: 'Test User',
      address: '123 Test Street',
      tel: '1234567890',
      avatar: 'avatar.png',
      gender: 'male',
    };

    it('should throw BadRequestException if email does not exist', async () => {
      mockAccountService.findByEmail.mockResolvedValue(null);

      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockAccountService.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email
      );
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      mockAccountService.findByEmail.mockResolvedValue(mockAccount);
      mockLoginDto.password = 'wrongpassword';

      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockAccountService.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email
      );
    });

    it('should throw BadRequestException if account is inactive', async () => {
      mockAccountService.findByEmail.mockResolvedValue({
        ...mockAccount,
        isActive: false,
      });

      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockAccountService.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email
      );
    });

    it('should return access token and user info if login is successful', async () => {
      mockLoginDto.password = 'password123';

      mockAccountService.findByEmail.mockResolvedValue(mockAccount);
      mockJwtService.signAsync.mockResolvedValue('mockAccessToken');

      const isMatch = await bcrypt.compare(
        mockLoginDto.password,
        mockAccount.password
      );
      expect(isMatch).toBe(true); // Đảm bảo mật khẩu khớp
      const result = await authService.login(mockLoginDto);

      expect(result).toEqual({
        msg: 'User has been login successfully!',
        acess_token: 'mockAccessToken',
        name: mockAccount.name,
        displayName: mockAccount.displayName,
        address: mockAccount.address,
        email: mockAccount.email,
        tel: mockAccount.tel,
        avatar: mockAccount.avatar,
        gender: mockAccount.gender,
        role: mockAccount.role,
      });
      expect(mockAccountService.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email
      );
      expect(mockJwtService.signAsync).toHaveBeenCalled();
    });
  });
});
