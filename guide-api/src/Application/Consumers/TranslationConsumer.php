<?php

namespace App\Application\Consumers;


use App\Domain\Guide\GuideApi;
use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Services\TranslationService;
use PhpAmqpLib\Channel\AMQPChannel;
use Symfony\Component\Console\Output\OutputInterface;

class TranslationConsumer
{
    /**
     * @param AMQPChannel $channel
     * @param OutputInterface $output
     */
    public function __construct(
        private readonly AMQPChannel        $channel,
        private readonly OutputInterface    $output,
        private readonly GuideApi           $guideApi,
        private readonly TranslationService $translationService,
    )
    {
    }

    public function listen(): void
    {
        $this->output->writeln("Started");

        $this->channel->queue_declare('translation', false, true, false, false);
        $this->channel->basic_qos(0, 1, null);

        $this->channel->basic_consume(
            queue: 'translation',
            callback: function ($message) {
                $this->output->writeln("Consuming message: {$message->body}");
                $decodedMessage = json_decode($message->body, true);

                $channel = $message->delivery_info['channel'];
                $channel->basic_ack($message->delivery_info['delivery_tag']);

                //in here we should have some more extensive error handler
                // eg. consumer should take care of guideId not existing, but errors of translation should be handled
                $guideContext = $this->guideApi->getGuideContext($decodedMessage['guideId']);
                $this->translationService->translate($guideContext, Language::from($decodedMessage['language']));
            }
        );

        while (count($this->channel->callbacks)) {
            $this->channel->wait();
        }
        $this->output->writeln("Done consuming messages!");
        $this->channel->close();
    }
}
