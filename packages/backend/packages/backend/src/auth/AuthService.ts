import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Register a new user
   */
  static async register(input: RegisterInput): Promise<{ userId: string; email: string; role: UserRole }> {
    const { email, password, name, role = UserRole.VIEWER } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    logger.info(`User registered: ${user.email} (${user.id})`);

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Login user and generate tokens
   */
  static async login(input: LoginInput, ipAddress?: string, userAgent?: string): Promise<AuthTokens & { user: { id: string; email: string; name: string; role: UserRole } }> {
    const { email, password } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role, ipAddress, userAgent);

    logger.info(`User logged in: ${user.email} (${user.id})`);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Generate access and refresh tokens
   */
  private static async generateTokens(
    userId: string,
    email: string,
    role: UserRole,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthTokens> {
    const payload: TokenPayload = {
      userId,
      email,
      role,
    };

    // Generate access token
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    // Generate refresh token
    const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };

      // Check if session exists and is valid
      const session = await prisma.session.findUnique({
        where: { refreshToken },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Delete old session
      await prisma.session.delete({
        where: { refreshToken },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role, ipAddress, userAgent);

      logger.info(`Token refreshed for user: ${user.email} (${user.id})`);

      return tokens;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout user by invalidating refresh token
   */
  static async logout(refreshToken: string): Promise<void> {
    try {
      await prisma.session.delete({
        where: { refreshToken },
      });

      logger.info('User logged out');
    } catch (error) {
      // Session might not exist, which is fine
      logger.debug('Logout attempted for non-existent session');
    }
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    logger.info(`Cleaned up ${result.count} expired sessions`);

    return result.count;
  }
}
