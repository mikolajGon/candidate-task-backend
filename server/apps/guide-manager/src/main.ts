import { NestFactory } from '@nestjs/core';
import { GuideManagerModule } from './guide-manager.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GuideManagerModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${process.env.KAFKA_ADDRESS}`],
        },
        consumer: {
          groupId: 'guide-manager-consumer',
        },
      },
    },
  );
  await app.listen();
}

void bootstrap();