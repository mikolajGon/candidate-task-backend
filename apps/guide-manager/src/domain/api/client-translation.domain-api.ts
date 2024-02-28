import { Inject, Injectable } from '@nestjs/common';
import { GUIDE_STORY_TOKEN, GuideStore } from '../entity/guide/guide.store';
import { Guide } from '../entity/guide/guide.entity';
import { Client } from '../entity/client/client.entity';
import { TranslationDispatchService } from '../service/translation-dispatch.service';
import { GuideContent, GuideLanguage } from '@lib/domain';
import { CLIENT_STORE_TOKEN, ClientStore } from '../entity/client/client.store';

@Injectable()
export class ClientTranslationDomainApi {
  constructor(
    @Inject(CLIENT_STORE_TOKEN)
    private readonly clientStore: ClientStore,
    @Inject(GUIDE_STORY_TOKEN)
    private readonly guideStore: GuideStore,
    private readonly translationDispatchService: TranslationDispatchService,
  ) {}

  public async clientTranslationRequest(
    clientId: string,
    guideInfo: {
      externalGuideId: string;
      language: GuideLanguage;
    },
  ) {
    const guideInit = await Guide.init(guideInfo, this.guideStore);

    const guide = guideInit.exists ? guideInit.get() : await guideInit.create();

    const clientInit = await Client.init(
      { clientId, guideId: guide.id },
      this.clientStore,
    );
    const client = clientInit.exists
      ? clientInit.get()
      : await clientInit.create();

    return await this.translationDispatchService.dispatchToClient(
      client,
      guide,
    );
  }

  public async newTranslation(
    externalGuideId: string,
    language: GuideLanguage,
    content: GuideContent,
  ) {
    const guideInit = await Guide.init(
      { externalGuideId, language, content },
      this.guideStore,
    );

    const guide = guideInit.exists ? guideInit.get() : await guideInit.create();

    if (!guide.isComplete) {
      await guide.complete(content);
    }

    return this.translationDispatchService.newTranslation(guide);
  }
}
