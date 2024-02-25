import { Controller, Get } from '@nestjs/common';
import { GuideTranslationService } from './guide-translation.service';

@Controller()
export class GuideTranslationController {
  constructor(
    private readonly guideTranslationService: GuideTranslationService,
  ) {}

  @Get()
  getHello(): string {
    return this.guideTranslationService.getHello();
  }
}
