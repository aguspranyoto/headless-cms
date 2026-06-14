import { Injectable, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../common/database/drizzle.provider';
import { users } from '../common/database/schema/users.schema';
import { verificationTokens } from '../common/database/schema/verification_tokens.schema';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private resend: Resend;

  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: ReturnType<typeof drizzle>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, registerDto.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new BadRequestException('Email is already registered');
    }

    const user = await this.usersService.create({
      ...registerDto,
      isActive: true,
    });
    
    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    await this.db.insert(verificationTokens).values({
      userId: user.id,
      token,
      expiresAt,
    });

    // Send email via Resend
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'notifier@agusp.com',
        to: user.email,
        subject: 'Verify your Headless CMS Account',
        html: `
          <h1>Welcome to Headless CMS!</h1>
          <p>Hi ${user.username},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background-color:#2563eb;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
          <p>Or copy this link: ${verifyUrl}</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // We don't fail the registration if email fails to send, but ideally we should.
    }

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      }
    };
  }

  async verifyEmail(token: string) {
    const [verificationToken] = await this.db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .limit(1);

    if (!verificationToken) {
      throw new BadRequestException('Invalid verification token');
    }

    if (new Date() > new Date(verificationToken.expiresAt)) {
      throw new BadRequestException('Verification token has expired');
    }

    // Mark user as verified
    await this.db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, verificationToken.userId));

    // Delete token
    await this.db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, verificationToken.id));

    // Fetch user to generate JWT
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, verificationToken.userId))
      .limit(1);

    const payload = { sub: user.id, email: user.email, role: user.role, isActive: user.isActive };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      }
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, isActive: user.isActive };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      }
    };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    const { email, firstName, lastName, picture } = req.user;
    
    // Check if user exists
    let [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      // Create user if not exists
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      user = await this.usersService.create({
        email,
        username,
        password: Math.random().toString(36).slice(-8), // Random password
        displayName: `${firstName} ${lastName}`,
        avatarUrl: picture,
        isActive: true,
      }) as any;
    }

    const payload = { sub: user.id, email: user.email, role: user.role, isActive: user.isActive };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      }
    };
  }
}
