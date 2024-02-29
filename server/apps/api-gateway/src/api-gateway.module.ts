import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AutoTranslateController } from './auto-translate/auto-translate.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientTranslationReadyController } from './auto-translate/client-translation-ready.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ClientsModule.register([
      {
        name: 'API_GATEWAY',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway',
            brokers: [`${process.env.KAFKA_ADDRESS}`],
          },
          consumer: {
            groupId: 'api-gateway-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AutoTranslateController, ClientTranslationReadyController],
})
export class ApiGatewayModule {}
