import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  permissions: string[];
}

class JwtService {
  private secret: string;
  private expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET!;
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  generateToken(payload: JwtPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: this.expiresIn,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      subject: payload.userId.toString()
    };

    return jwt.sign(payload, this.secret, options);
  }

  generateRefreshToken(userId: number): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      this.secret,
      { expiresIn: '7d' }
    );
  }
}

export default JwtService;