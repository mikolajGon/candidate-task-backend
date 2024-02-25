import { Injectable } from '@nestjs/common';

@Injectable()
export class GuideTranslationService {
  getHello(): string {
    return 'Hello World!';
  }
}
