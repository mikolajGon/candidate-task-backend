import { HttpService } from '@nestjs/axios';
import { GuideLanguage } from '@lib/domain';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { TranslateFacade } from '../../domain/service/port/translate.facade';

@Injectable()
export class TranslateHttpFacade implements TranslateFacade {
  constructor(private readonly httpService: HttpService) {}

  public async translate(translation: {
    languageFrom: GuideLanguage;
    languageTo: GuideLanguage;
    text: string;
  }) {
    const source = this.convertLanguage(translation.languageFrom);
    const target = this.convertLanguage(translation.languageTo);
    const replyObservable = this.httpService.post(
      `${process.env.LIBRETRANSLATE_ADDRESS}`,
      {
        q: translation.text,
        source,
        target,
      },
    );

    const reply = await firstValueFrom(replyObservable);

    // should validate first with zod - skipping since it is POC
    return reply.data.translatedText;
  }

  private convertLanguage(language: GuideLanguage): string {
    return language.split('_')[0];
  }
}
