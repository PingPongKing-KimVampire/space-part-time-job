import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  generateRandomNumberCode(length: number): string {
    const code = Math.floor(Math.random() * Math.pow(10, length));
    return code.toString().padStart(length, '0');
  }

  getSecondUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  }
}
