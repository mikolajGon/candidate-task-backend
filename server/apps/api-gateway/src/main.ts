import { NestFactory, Reflector } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Transport } from '@nestjs/microservices';
import { TimeoutInterceptor } from './infrastructure/timeout/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${process.env.KAFKA_ADDRESS}`],
      },
      consumer: {
        groupId: 'api-gateway-consumer',
      },
    },
  });

  await app.startAllMicroservices();

  app.useGlobalInterceptors(new TimeoutInterceptor(app.get(Reflector)));

  await app.listen(3000);
}

void bootstrap();
