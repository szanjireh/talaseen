import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly apiKey: string;
  private readonly sender: string;
  private readonly templateId: string;

  constructor(private configService: ConfigService) {
    // Kavenegar API credentials
    this.apiKey = this.configService.get('KAVENEGAR_API_KEY') || '';
    this.sender = this.configService.get('KAVENEGAR_SENDER') || '10008663';
    this.templateId = this.configService.get('KAVENEGAR_TEMPLATE') || 'verify';
  }

  async sendOtp(phone: string, code: string): Promise<boolean> {
    // If no API key configured, just log (for development)
    if (!this.apiKey) {
      console.log(`[SMS] OTP Code for ${phone}: ${code}`);
      return true;
    }

    try {
      // Kavenegar API endpoint
      const url = `https://api.kavenegar.com/v1/${this.apiKey}/verify/lookup.json`;
      
      const response = await axios.post(url, null, {
        params: {
          receptor: phone,
          token: code,
          template: this.templateId,
        },
      });

      return response.data.return.status === 200;
    } catch (error) {
      console.error('[SMS] Failed to send OTP:', error.message);
      return false;
    }
  }

  /**
   * Generate a 6-digit OTP code
   */
  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Validate phone number format (Iranian mobile numbers)
   */
  validatePhoneNumber(phone: string): boolean {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    
    // Iranian mobile: 09XXXXXXXXX (11 digits starting with 09)
    const iranianMobile = /^09\d{9}$/;
    
    return iranianMobile.test(cleaned);
  }

  /**
   * Normalize phone number to standard format
   */
  normalizePhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If starts with +98, remove it and add 0
    if (cleaned.startsWith('98')) {
      cleaned = '0' + cleaned.slice(2);
    }
    
    return cleaned;
  }
}
