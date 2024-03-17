<?php

declare(strict_types=1);

use App\Domain\Guide\ContentRepository;
use App\Domain\Guide\GuideRepository;
use App\Infrastructure\Persistence\Guide\InMemoryGuideRepository;
use DI\ContainerBuilder;

return function (ContainerBuilder $containerBuilder) {
    // Here we map our UserRepository interface to its in memory implementation
    $containerBuilder->addDefinitions([
        GuideRepository::class => \DI\autowire(InMemoryGuideRepository::class),
        ContentRepository::class => \DI\autowire(InMemoryGuideRepository::class),
    ]);
};
