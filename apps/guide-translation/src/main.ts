import { NestFactory } from '@nestjs/core';
import { GuideTranslationModule } from './guide-translation.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GuideTranslationModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:19092'],
        },
        consumer: {
          groupId: 'guide-translation-consumer',
        },
      },
    },
  );
  await app.listen();
}

void bootstrap();
