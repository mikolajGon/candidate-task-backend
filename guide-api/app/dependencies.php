<?php

declare(strict_types=1);

use App\Application\Settings\SettingsInterface;
use DI\ContainerBuilder;
use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\UidProcessor;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Channel\AMQPChannel;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        LoggerInterface::class => function (ContainerInterface $c) {
            $settings = $c->get(SettingsInterface::class);

            $loggerSettings = $settings->get('logger');
            $logger = new Logger($loggerSettings['name']);

            $processor = new UidProcessor();
            $logger->pushProcessor($processor);

            $handler = new StreamHandler($loggerSettings['path'], $loggerSettings['level']);
            $logger->pushHandler($handler);

            return $logger;
        },
        EntityManager::class => function (ContainerInterface $c) {
            $settings = $c->get(SettingsInterface::class)->get('doctrine');
            $is_dev = $settings['dev_mode'];

            $config = ORMSetup::createAttributeMetadataConfiguration([$settings['metadata_dirs']], $is_dev);


            $conn = DriverManager::getConnection($settings['connection']);

            return new EntityManager($conn, $config);
        },

        AMQPStreamConnection::class => function () {
            return new AMQPStreamConnection(
                "localhost",
                5672,
                'guest',
                'guest',
                '/');
        }
    ]);
};
