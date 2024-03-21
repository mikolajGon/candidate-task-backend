<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide;

use App\Application\Actions\Guide\Dto\GuideDto;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;
use Psr\Http\Message\ResponseInterface as Response;

class CreateGuideAction extends GuideAction
{

    protected function action(): Response
    {

        $guideBody = $this->getFormData();
        $steps = array_map(function (array $steps) {
            return new ContentStep($steps['title'], $steps['content']);
        }, $guideBody['steps']);

        $guideContext = $this->guideApi->createGuideContext($guideBody['title'], Language::from($guideBody['language']), $steps);

        $this->logger->info("Guide of id `{$guideContext->getGuideId()}` was created.");

        $response = array_map(function (Content $content) use ($guideContext) {
            return GuideDto::fromContent($guideContext->getGuideId(), $content);
        }, $guideContext->getAllContent());


        return $this->respondWithData($response, 201);
    }
}
