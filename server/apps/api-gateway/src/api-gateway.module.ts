import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientTranslationReadyController } from './auto-translate/client-translation-ready.controller';
import { AutoTranslateController } from './auto-translate/auto-translate.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TimedOutTranslationService } from './auto-translate/timed-out-translation.service';

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
  controllers: [ClientTranslationReadyController, AutoTranslateController],
  providers: [TimedOutTranslationService],
})
export class ApiGatewayModule {}
