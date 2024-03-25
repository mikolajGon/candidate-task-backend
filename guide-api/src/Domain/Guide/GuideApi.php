<?php

namespace App\Domain\Guide;

use App\Domain\DomainException\DomainInfrastructureException;
use App\Domain\Guide\Context\GuideContext;
use App\Domain\Guide\Exceptions\GuideNotFoundException;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;
use App\Domain\Guide\Ports\ContentRepository;
use App\Domain\Guide\Ports\ContentStepRepository;
use App\Domain\Guide\Ports\GuideContentRepository;
use App\Domain\Guide\Ports\GuideRepository;

class GuideApi
{

    public function __construct(
        private readonly GuideRepository        $guideRepository,
        private readonly ContentRepository      $contentRepository,
        private readonly ContentStepRepository  $contentStepRepository,
        private readonly GuideContentRepository $guideContentRepository)
    {
    }

    /**
     * @throws DomainInfrastructureException
     * @throws GuideNotFoundException
     */
    public function getGuideContext(int $id): GuideContext
    {
        $guide = $this->guideRepository->getGuide($id);
        return new GuideContext($guide, $this->contentRepository, $this->contentStepRepository, $this->guideContentRepository);
    }

    /**
     * @param string $title
     * @param Language $language
     * @param ContentStep[] $content
     * @return GuideContext
     * @throws DomainInfrastructureException
     */
    public function createGuideContext(string $title, Language $language, array $content): GuideContext
    {
        $guide = $this->guideContentRepository->create($title, $language, $content);
        return new GuideContext($guide, $this->contentRepository, $this->contentStepRepository, $this->guideContentRepository);
    }


}
