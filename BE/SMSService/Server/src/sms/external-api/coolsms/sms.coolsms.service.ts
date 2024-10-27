import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const coolsms = require('coolsms-node-sdk').default;

@Injectable()
export class CoolSMSService {
  constructor(private readonly configService: ConfigService) {}
  sendMessage(
    senderPhoneNumber: string,
    receiverPhoneNumber: string,
    message: string,
  ) {
    const key = this.configService.get<string>('COOLSMS_API_KEY');
    const secret = this.configService.get<string>('COOLSMS_API_SECRET');
    const messageService = new coolsms(key, secret);
    messageService
      .sendOne({
        to: receiverPhoneNumber,
        from: senderPhoneNumber,
        text: message,
      })
      .then((res) => {
        //추후 로깅
      })
      .catch((err) => console.error(err));
  }
}
