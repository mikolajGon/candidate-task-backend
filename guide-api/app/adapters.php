<?php

declare(strict_types=1);

use App\Domain\Guide\Ports\ContentRepository;
use App\Domain\Guide\Ports\ContentStepRepository;
use App\Domain\Guide\Ports\GuideContentRepository;
use App\Domain\Guide\Ports\GuideRepository;
use App\Domain\Guide\Ports\TranslationProvider;
use App\Domain\Guide\Ports\TranslationScheduler;
use App\Infrastructure\NotFake\NotFakeTranslationProvider;
use App\Infrastructure\Persistence\Postgres\PostgresContentRepository;
use App\Infrastructure\Persistence\Postgres\PostgresContentStepRepository;
use App\Infrastructure\Persistence\Postgres\PostgresGuideContentRepository;
use App\Infrastructure\Persistence\Postgres\PostgresGuideRepository;
use App\Infrastructure\Queue\RabbitMQ\RabbitMqTranslationProducer;
use DI\ContainerBuilder;

return function (ContainerBuilder $containerBuilder) {
    // Here we map our UserRepository interface to its in memory implementation
    $containerBuilder->addDefinitions([
        GuideRepository::class => \DI\autowire(PostgresGuideRepository::class),
        ContentRepository::class => \DI\autowire(PostgresContentRepository::class),
        GuideContentRepository::class => \DI\autowire(PostgresGuideContentRepository::class),
        ContentStepRepository::class => \DI\autowire(PostgresContentStepRepository::class),
        TranslationScheduler::class => \DI\autowire(RabbitMqTranslationProducer::class),
        TranslationProvider::class => \DI\autowire(NotFakeTranslationProvider::class),
    ]);
};
