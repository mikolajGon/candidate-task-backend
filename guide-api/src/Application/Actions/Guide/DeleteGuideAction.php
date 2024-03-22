<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Exceptions\GuideNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;

class DeleteGuideAction extends GuideAction
{

    /**
     * @throws DomainInfrastructureException
     * @throws GuideNotFoundException
     */
    protected function action(): Response
    {
        // Since it is POC we assume request validation exist
        $guideId = (int)$this->resolveArg('id');
        $guideContext = $this->guideApi->getGuideContext($guideId);
        $guideContext->delete($guideId);

        $this->logger->info("Guide of id `{$guideId}` was deleted.");

        return $this->respondWithData(null, 204);
    }
}
