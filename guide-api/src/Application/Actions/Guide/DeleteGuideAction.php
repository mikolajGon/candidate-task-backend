<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteGuideAction extends GuideAction
{

    protected function action(): Response
    {
        $guideId = (int)$this->resolveArg('id');
        $guideContext = $this->guideApi->getGuideContext($guideId);
        $guideContext->delete($guideId);

        $this->logger->info("Guide of id `{$guideId}` was deleted.");

        return $this->respondWithData(null, 204);
    }
}
