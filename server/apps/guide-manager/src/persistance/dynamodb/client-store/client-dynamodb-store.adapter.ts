import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'nestjs-dynamoose';
import { ClientModel, ClientObject } from './client.schema';
import { ClientStore } from '../../../domain/entity/client/client.store';
import {
  Client,
  ClientInit,
} from 'apps/guide-manager/src/domain/entity/client/client.entity';

@Injectable()
export class ClientDynamoDbStore implements ClientStore {
  private readonly logger = new Logger(ClientDynamoDbStore.name);
  constructor(
    @InjectModel('ClientModel')
    private clientModel: ClientModel,
  ) {}

  async get(client: {
    clientId: string;
    guideId: string;
  }): Promise<ClientInit | null> {
    try {
      const result = await this.clientModel.get(client);

      if (result === undefined) return null;

      return result;
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }
  async save(client: Client): Promise<void> {
    try {
      await this.clientModel.create(this.domainToModel(client));
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }
  async getClientsForGuideId(guideId: string): Promise<ClientInit[]> {
    try {
      return await this.clientModel.query('guideId').eq(guideId).all().exec();
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }
  async deleteClients(clients: Client[]): Promise<void> {
    if (clients.length < 1) return;

    try {
      await this.clientModel.batchDelete(
        clients.map(this.domainToModel.bind(this)),
      );
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }
  async saveClients(clients: Client[]): Promise<void> {
    if (clients.length < 1) return;

    try {
      await this.clientModel.batchPut(
        clients.map(this.domainToModel.bind(this)),
      );
    } catch (e) {
      this.logger.log(e);
      throw e;
    }
  }

  private domainToModel(client: Client): ClientObject {
    return {
      clientId: client.clientId,
      guideId: client.guideId,
    };
  }
}
