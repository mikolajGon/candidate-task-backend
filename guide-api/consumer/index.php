<?php


use App\Application\Consumers\TranslationConsumer;
use App\Domain\Guide\GuideApi;
use App\Domain\Guide\Services\TranslationService;
use DI\ContainerBuilder;
use PhpAmqpLib\Channel\AMQPChannel;
use Symfony\Component\Console\Output\ConsoleOutput;

require __DIR__ . '/../vendor/autoload.php';

// Instantiate PHP-DI ContainerBuilder
$containerBuilder = new ContainerBuilder();

if (false) { // Should be set to true in production
    $containerBuilder->enableCompilation(__DIR__ . '/../var/cache');
}

// Set up settings
$settings = require __DIR__ . '/../app/settings.php';
$settings($containerBuilder);

// Set up dependencies
$dependencies = require __DIR__ . '/../app/dependencies.php';
$dependencies($containerBuilder);

// Set up repositories
$repositories = require __DIR__ . '/../app/repositories.php';
$repositories($containerBuilder);

// Build PHP-DI Container instance
$container = $containerBuilder->build();

$output = new ConsoleOutput();

$consumer = new TranslationConsumer(
    $container->get(AMQPChannel::class),
    $output,
    $container->get(GuideApi::class),
    $container->get(TranslationService::class)
);

$consumer->listen();
