<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide;

use App\Application\Actions\Guide\Dto\GuideDto;
use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Exceptions\GuideNotFoundException;
use App\Domain\Guide\Exceptions\IncorrectContentException;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;
use Psr\Http\Message\ResponseInterface as Response;

class UpdateGuideContentAction extends GuideAction
{

    /**
     * @throws GuideNotFoundException
     * @throws IncorrectContentException
     * @throws DomainInfrastructureException
     */
    protected function action(): Response
    {
        // Since it is POC we assume request validation exist
        $guideId = (int)$this->resolveArg('id');
        $language = Language::from($this->resolveArg('language'));

        $guideContext = $this->guideApi->getGuideContext($guideId);

        $contentBody = $this->getFormData();

        $steps = array_map(function (array $steps) {
            return new ContentStep($steps['title'], $steps['content']);
        }, $contentBody['steps']);

        $content = new Content($guideId, $language, $contentBody['title'], $steps);


        $updatedContents = $guideContext->updateContent($content);
        $this->logger->info("Guide of id `{$guideContext->getGuideId()}` was updated.");

        $response = GuideDto::fromContent($guideContext->getGuideId(), $updatedContents);

        return $this->respondWithData($response, 202);
    }
}
