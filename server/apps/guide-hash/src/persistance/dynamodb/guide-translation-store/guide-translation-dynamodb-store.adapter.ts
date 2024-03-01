import { Injectable, Logger } from '@nestjs/common';
import { GuideStore } from '../../../domain/entity/guide/guide.store';
import { Guide } from '../../../domain/entity/guide/guide.entity';
import { GuideLanguage } from '@lib/domain/entity/common/language.enum';
import { InjectModel } from 'nestjs-dynamoose';
import { GuideModel } from './guide.schema';

@Injectable()
export class GuideDynamodbStore implements GuideStore {
  private readonly logger = new Logger(GuideDynamodbStore.name);
  constructor(
    @InjectModel('GuideModel')
    private guideModel: GuideModel,
  ) {}
  async create(guideTranslation: Guide): Promise<void> {
    await this.guideModel.create({
      hash: guideTranslation.hash,
      language: guideTranslation.language,
      id: guideTranslation.id,
    });
  }
  async getId(hash: string, language: GuideLanguage): Promise<string | null> {
    try {
      const result = await this.guideModel.get({ hash, language });

      if (result === undefined) return null;

      return result.id;
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  async translationExists(
    guideId: string,
    language: GuideLanguage,
  ): Promise<boolean> {
    try {
      const result = await this.guideModel
        .query('id')
        .using('idIndex')
        .eq(guideId)
        .where('language')
        .eq(language)
        .exec();

      return result.count > 0;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  async idExists(guideId: string): Promise<boolean> {
    try {
      const result = await this.guideModel
        .query('id')
        .using('idIndex')
        .eq(guideId)
        .exec();

      return result.count > 0;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }
}
