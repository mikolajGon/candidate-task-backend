<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide;

use App\Application\Actions\Action;
use App\Domain\Guide\GuideApi;
use Psr\Log\LoggerInterface;

abstract class GuideAction extends Action
{
    protected GuideApi $guideApi;

    public function __construct(LoggerInterface $logger, GuideApi $guideApi)
    {
        parent::__construct($logger);
        $this->guideApi = $guideApi;
    }
}
