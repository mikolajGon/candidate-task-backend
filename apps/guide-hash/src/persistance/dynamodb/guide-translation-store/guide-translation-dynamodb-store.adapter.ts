import { Injectable } from '@nestjs/common';
import { GuideStore } from '../../../domain/entity/guide/guide.store';
import { Guide } from '../../../domain/entity/guide/guide.entity';
import { GuideLanguage } from '../../../domain/entity/guide/language.enum';
import { InjectModel } from 'nestjs-dynamoose';
import { GuideModel } from './guide.schema';

@Injectable()
export class GuideDynamodbStore implements GuideStore {
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
      console.log(e);
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
      console.error(e);
      return false;
    }
  }
}
