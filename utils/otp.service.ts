// bypass TypeScript type checking
const imaps = require('imap-simple');

// @ts-ignore: No type declarations for 'mailparser'
import { simpleParser } from 'mailparser';

export class OTPService {
  async getLatestOTP(): Promise<string> {
    const config = {
      imap: {
        user: process.env.EMAIL_USER!,
        password: process.env.EMAIL_PASSWORD!,
        host: process.env.IMAP_HOST!,
        port: Number(process.env.IMAP_PORT!),
        tls: true,
      },
    };

    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: [''],
      markSeen: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    if (!messages.length) {
      throw new Error('No OTP email found');
    }

    const latest = messages[messages.length - 1];
    const allParts = latest.parts.find((p: any) => p.which === '');

    const parsed = await simpleParser(allParts.body);
    const body = parsed.text || '';

    const otpMatch = body.match(/\b\d{4,8}\b/);

    if (!otpMatch) {
      throw new Error('OTP not found in email');
    }

    await connection.end();

    return otpMatch[0];
  }

  async pollOTP(retries = 6, delay = 5000): Promise<string> {
    for (let i = 0; i < retries; i++) {
      try {
        return await this.getLatestOTP();
      } catch {
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw new Error('OTP not received in time');
  }
}
