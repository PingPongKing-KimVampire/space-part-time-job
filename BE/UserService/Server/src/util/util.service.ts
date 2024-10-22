import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  generateRandomNumberCode(length: number): string {
	const code = Math.floor(Math.random() * Math.pow(10, length));
    return code.toString().padStart(length, '0');
  }
}
