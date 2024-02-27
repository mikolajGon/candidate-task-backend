import { Inject, Injectable } from '@nestjs/common';
import {
  Translation,
  TranslationEntityInit,
} from '../../entity/translation/translation.entity';
import {
  TranslationStore,
  TranslationStoreToken,
} from '../../entity/translation/translation-store';
import { TranslatorService } from '../../service/translator.service';

@Injectable()
export class TranslateDomainApi {
  constructor(
    @Inject(TranslationStoreToken)
    private readonly translationStore: TranslationStore,
    private readonly translatorService: TranslatorService,
  ) {}

  public async createNewTranslation(
    newTranslation: TranslationEntityInit,
  ): Promise<void> {
    const translationInit = await Translation.init(
      newTranslation,
      this.translationStore,
    );
    if (!translationInit.exists) {
      await translationInit.create();
      this.translatorService.scheduleTranslation();
    }
  }
}
