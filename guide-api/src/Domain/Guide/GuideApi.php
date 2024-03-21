<?php

namespace App\Domain\Guide;

use App\Domain\Guide\Models\Content;
use App\Domain\Guide\Models\ContentStep;
use App\Domain\Guide\Models\Language;

class GuideApi
{

    public function __construct(
        private readonly GuideRepository        $guideRepository,
        private readonly ContentRepository      $contentRepository,
        private readonly GuideContentRepository $guideContentRepository)
    {
    }

    public function getGuideContext(int $id): GuideContext
    {
        $guide = $this->guideRepository->getGuide($id);
        return new GuideContext($guide, $this->contentRepository, $this->guideContentRepository);
    }

    /**
     * @param string $title
     * @param Language $language
     * @param ContentStep[] $content
     * @return GuideContext
     */
    public function createGuideContext(string $title, Language $language, array $content): GuideContext
    {
        $guide = $this->guideRepository->createGuide();
        $this->contentRepository->createContent(new Content($guide->getId(), $language, $title, $content));

        return new GuideContext($guide, $this->contentRepository, $this->guideContentRepository);
    }


}
