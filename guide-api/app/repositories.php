<?php

declare(strict_types=1);

use App\Domain\Guide\ContentRepository;
use App\Domain\Guide\GuideContentRepository;
use App\Domain\Guide\GuideRepository;
use App\Infrastructure\Persistence\Postgres\PostgresGuideContentRepository;
use App\Infrastructure\Persistence\Postgres\PostgresGuideRepository;
use DI\ContainerBuilder;

return function (ContainerBuilder $containerBuilder) {
    // Here we map our UserRepository interface to its in memory implementation
    $containerBuilder->addDefinitions([
        GuideRepository::class => \DI\autowire(PostgresGuideRepository::class),
        ContentRepository::class => \DI\autowire(PostgresGuideRepository::class),
        GuideContentRepository::class => \DI\autowire(PostgresGuideContentRepository::class),
    ]);
};
