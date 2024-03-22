<?php

declare(strict_types=1);

namespace App\Application\Actions\Guide;

use App\Application\Actions\Guide\Dto\GuideDto;
use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Exceptions\GuideNotFoundException;
use App\Domain\Guide\Exceptions\IncorrectContentException;
use App\Domain\Guide\GuideApi;
use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Services\TranslationService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Log\LoggerInterface;

class TranslateGuideContentAction extends GuideAction
{

    public function __construct(
        private readonly TranslationService $translationService,
        LoggerInterface $logger, GuideApi $guideApi)
    {
        parent::__construct($logger, $guideApi);
    }

    /**
     * @throws GuideNotFoundException
     * @throws IncorrectContentException
     * @throws DomainInfrastructureException
     */
    protected function action(): Response
    {
        // Since it is POC we assume request validation exist
        $guideId = (int) $this->resolveArg('id');
        $languages = array_map(function (string $language) {
            return Language::from($language);
        },(array)$this->getFormData()['languages']);

        $guideContext = $this->guideApi->getGuideContext($guideId);

        foreach ($languages as $language){
            $this->translationService->scheduleTranslation($guideContext, $language);
        }

        return $this->respondWithData(null, 202);
    }
}
