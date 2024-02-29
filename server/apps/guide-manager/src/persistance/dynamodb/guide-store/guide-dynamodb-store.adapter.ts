import { Injectable, Logger } from '@nestjs/common';
import { GuideLanguage } from '@lib/domain/entity/common/language.enum';
import { InjectModel } from 'nestjs-dynamoose';
import { GuideModel, GuideObject } from './guide.schema';
import { GuideStore } from '../../../domain/entity/guide/guide.store';
import {
  Guide,
  GuideEntityConstructor,
} from '../../../domain/entity/guide/guide.entity';

@Injectable()
export class GuideDynamodbStore implements GuideStore {
  private readonly logger = new Logger(GuideDynamodbStore.name);
  constructor(
    @InjectModel('GuideModel')
    private guideModel: GuideModel,
  ) {}
  async get(
    externalId: string,
    language: GuideLanguage,
  ): Promise<GuideEntityConstructor | null> {
    try {
      const result = await this.guideModel.get({ externalId, language });

      if (result === undefined) return null;

      return this.toDomain(result);
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  async save(guide: Guide): Promise<void> {
    try {
      await this.guideModel.create(this.toObjectModel(guide));
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  async update(guide: Guide): Promise<void> {
    try {
      await this.guideModel.update(this.toObjectModel(guide));
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  private toObjectModel(guide: Guide): GuideObject {
    return {
      externalId: guide.externalGuideId,
      id: guide.id,
      language: guide.language,
      content: JSON.stringify(guide.content),
    };
  }
  private toDomain(guide: GuideObject): GuideEntityConstructor {
    return {
      ...guide,
      externalGuideId: guide.externalId,
      content:
        guide.content !== undefined ? JSON.parse(guide.content) : undefined,
    };
  }
}
