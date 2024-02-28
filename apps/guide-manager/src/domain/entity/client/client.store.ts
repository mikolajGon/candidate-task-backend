import { Client, ClientConstructor } from './client.entity';

export const CLIENT_STORE_TOKEN = 'ClientStoreToken' as const;
export interface ClientStore {
  get(client: {
    clientId: string;
    guideId: string;
  }): Promise<ClientConstructor | null>;

  save(client: Client): Promise<void>;

  getClientsForGuideId(guideId: string): Promise<ClientConstructor[]>;

  deleteClients(clients: Client[]): Promise<void>;
  saveClients(clients: Client[]): Promise<void>;
}
