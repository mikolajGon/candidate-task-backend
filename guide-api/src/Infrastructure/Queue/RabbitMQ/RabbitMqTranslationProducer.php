<?php

namespace App\Infrastructure\Queue\RabbitMQ;

use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Ports\TranslationScheduler;
use PhpAmqpLib\Channel\AMQPChannel;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMqTranslationProducer implements TranslationScheduler
{
    /**
     * @param AMQPChannel $channel
     */
    public function __construct(private readonly AMQPChannel $channel)
    {
    }

    function scheduleTranslation(int $guideId, Language $language): void
    {
        $queuedMessage = ['guideId' => $guideId, 'language' => $language->value];
        $this->channel->queue_declare('translation', false, true, false, false);
        $newMessage = new AMQPMessage(
            json_encode($queuedMessage),
            array('delivery_mode' => 2)
        );

        $this->channel->basic_publish($newMessage, '', 'translation');

        $this->channel->close();
    }
}
