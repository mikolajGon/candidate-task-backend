import { Module } from '@nestjs/common';
import { GuideTranslationController } from './guide-translation.controller';
import { GuideTranslationService } from './guide-translation.service';

@Module({
  imports: [],
  controllers: [GuideTranslationController],
  providers: [GuideTranslationService],
})
export class GuideTranslationModule {}
