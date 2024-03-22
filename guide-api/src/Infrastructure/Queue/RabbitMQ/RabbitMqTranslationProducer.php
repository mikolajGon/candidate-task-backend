<?php

namespace App\Infrastructure\Queue\RabbitMQ;

use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Ports\TranslationScheduler;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMqTranslationProducer implements TranslationScheduler
{
    public function __construct(private readonly AMQPStreamConnection $connection)
    {
    }

    function scheduleTranslation(int $guideId, Language $language): void
    {
        $channel = $this->connection->channel();
        $queuedMessage = ['guideId' => $guideId, 'language' => $language->value];
        $channel->queue_declare('translation', false, true, false, false);
        $newMessage = new AMQPMessage(
            json_encode($queuedMessage),
            array('delivery_mode' => 2)
        );

        $channel->basic_publish($newMessage, '', 'translation');

        $channel->close();
    }
}
