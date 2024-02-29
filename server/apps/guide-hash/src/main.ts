import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GuideHashModule } from './guide-hash.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GuideHashModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${process.env.KAFKA_ADDRESS}`],
        },
        consumer: {
          groupId: 'guide-hash-consumer',
        },
      },
    },
  );
  await app.listen();
}

void bootstrap();
