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

class UpdateGuideAction extends GuideAction
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
        $guideContext = $this->guideApi->getGuideContext($guideId);

        $guideBody = $this->getFormData();

        $contents = array_map(function (array $guide) use ($guideId) {
            $steps = array_map(function (array $steps) {
                return new ContentStep($steps['title'], $steps['content']);
            }, $guide['steps']);

            return new Content($guideId, Language::from($guide['language']), $guide['title'], $steps);
        }, $guideBody);


        $updatedContents = $guideContext->replaceContent($contents);
        $this->logger->info("Guide of id `{$guideContext->getGuideId()}` was updated.");

//        $response = array_map(function (Content $content) use ($guideContext) {
//            return GuideDto::fromContent($guideContext->getGuideId(), $content);
//        }, $updatedContents);
        return $this->respondWithData($updatedContents, 204);
    }
}
