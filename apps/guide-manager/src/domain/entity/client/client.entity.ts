import { entityDoNotExists, entityExists, EntityInit } from '@lib/domain/utils';
import { ClientStore } from './client.store';

export type ClientInit = {
  clientId: string;
  guideId: string;
};

export type ClientConstructor = ClientInit;

export class Client {
  public static async init(
    clientInit: ClientInit,
    clientStore: ClientStore,
  ): EntityInit<Client> {
    const clientProps = await clientStore.get(clientInit);

    if (clientProps === null) {
      return entityDoNotExists(async () => {
        const client = new this(clientInit, clientStore);
        await clientStore.save(client);
        return client;
      });
    }

    return entityExists(() => new this(clientInit, clientStore));
  }

  public static async processClientsForGuideId(
    guideId: string,
    processClientsForGuideId: (pendingTranslation: Client[]) => void,
    clientStore: ClientStore,
  ) {
    const clientConstructors = await clientStore.getClientsForGuideId(guideId);

    const clients = clientConstructors.map(
      (clientConstructor) => new this(clientConstructor, clientStore),
    );
    try {
      processClientsForGuideId(clients);
      await clientStore.deleteClients(clients);
    } catch (e) {
      await clientStore.saveClients(clients);
      throw e;
    }
  }

  public get clientId(): string {
    return this.client.clientId;
  }

  public get guideId(): string {
    return this.client.guideId;
  }

  private constructor(
    private readonly client: ClientConstructor,
    private readonly clientStore: ClientStore,
  ) {}

  public async clientHasBeenNotified() {
    await this.clientStore.deleteClients([this]);
  }
}
