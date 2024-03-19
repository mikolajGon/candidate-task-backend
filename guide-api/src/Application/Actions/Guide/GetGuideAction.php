<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide;

use App\Application\Actions\Guide\Dto\GuideDto;
use App\Domain\Guide\Models\Content;
use Psr\Http\Message\ResponseInterface as Response;

class GetGuideAction extends GuideAction {

    protected function action(): Response
    {

        $guideId = (int) $this->resolveArg('id');
        $guide = $this->guideApi->getGuideContext($guideId);

        $this->logger->info("Guide of id `{$guideId}` was viewed.");

        $response = array_map(function(Content $content) use ($guideId) {
            return GuideDto::fromContent($guideId, $content);
        }, $guide->getAllContent());



        return $this->respondWithData($response);
    }
}
